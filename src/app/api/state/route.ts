import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const PREFIX = "state_v1_"
const MAX_CHUNK = 3500 // 4KB対策：余裕をもって

async function readChunks(jar: Awaited<ReturnType<typeof cookies>>) {
  let parts: string[] = []
  for (let i = 0; i < 50; i++) { // 最大50個=約170KB目安
    const v = jar.get(PREFIX + i)?.value
    if (!v) break
    parts.push(v)
  }
  return parts.join("")
}

async function writeChunks(jar: Awaited<ReturnType<typeof cookies>>, b64: string) {
  // 既存削除（多めに掃除）
  for (let i = 0; i < 50; i++) {
    await jar.set(PREFIX + i, "", { path: "/", maxAge: 0 })
  }
  // 分割書き込み
  let idx = 0
  for (let p = 0; p < b64.length; p += MAX_CHUNK) {
    const chunk = b64.slice(p, p + MAX_CHUNK)
    await jar.set(PREFIX + idx, chunk, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: "lax" as const,
      path: "/", 
      maxAge: 60 * 60 * 24 * 365, // 1年
    })
    idx++
  }
}

export async function GET() {
  try {
    const jar = await cookies()
    const b64 = await readChunks(jar)
    if (!b64) return NextResponse.json({ ok: true, data: null })
    
    const json = Buffer.from(b64, "base64").toString("utf8")
    const data = JSON.parse(json)
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    console.error('State GET error:', error)
    return NextResponse.json({ ok: false, data: null }, { status: 400 })
  }
}

export async function POST(req: Request) {
  try {
    const jar = await cookies()
    const body = await req.json().catch(() => null)
    
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    
    // body は { data: 任意のオブジェクト } を想定
    const json = JSON.stringify(body.data ?? null)
    const b64 = Buffer.from(json, "utf8").toString("base64")
    await writeChunks(jar, b64)
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('State POST error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
