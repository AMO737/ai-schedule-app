import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const PREFIX = "state_v1_"
const MAX_CHUNK = 3500 // 4KB対策：余裕をもって

async function readChunks(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  let parts: string[] = []
  for (let i = 0; i < 50; i++) { // 最大50個=約170KB目安
    const v = cookieStore.get(PREFIX + i)?.value
    if (!v) break
    parts.push(v)
  }
  return parts.join("")
}

async function writeChunks(cookieStore: Awaited<ReturnType<typeof cookies>>, b64: string) {
  // 既存削除（多めに掃除）
  for (let i = 0; i < 50; i++) {
    cookieStore.set(PREFIX + i, "", { path: "/", maxAge: 0 })
  }
  // 分割書き込み
  let idx = 0
  for (let p = 0; p < b64.length; p += MAX_CHUNK) {
    const chunk = b64.slice(p, p + MAX_CHUNK)
    cookieStore.set(PREFIX + idx, chunk, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: "lax" as const,
      path: "/", 
      maxAge: 60 * 60 * 24 * 365, // 1年
    })
    idx++
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    console.log('📥 GET /api/state: Cookieから状態を読み込み中...')
    const cookieStore = await cookies()
    const b64 = await readChunks(cookieStore)
    
    if (!b64) {
      console.log('📥 GET /api/state: Cookieにデータなし')
      return NextResponse.json({ ok: true, data: null })
    }
    
    const json = Buffer.from(b64, "base64").toString("utf8")
    const data = JSON.parse(json)
    console.log('📥 GET /api/state: 復元完了')
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    console.error('❌ GET /api/state error:', error)
    return NextResponse.json({ ok: false, data: null }, { status: 400 })
  }
}

export async function POST(req: Request) {
  try {
    console.log('📤 POST /api/state: Cookieに状態を保存中...')
    const cookieStore = await cookies()
    const body = await req.json().catch(() => null)
    
    if (!body || typeof body !== "object") {
      console.error('❌ POST /api/state: 無効なリクエストボディ')
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    
    // body は { data: 任意のオブジェクト } を想定
    const json = JSON.stringify(body.data ?? null)
    const b64 = Buffer.from(json, "utf8").toString("base64")
    await writeChunks(cookieStore, b64)
    
    console.log('✅ POST /api/state: 保存完了')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ POST /api/state error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


const PREFIX = "state_v1_"
const MAX_CHUNK = 3500 // 4KB対策：余裕をもって

async function readChunks(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  let parts: string[] = []
  for (let i = 0; i < 50; i++) { // 最大50個=約170KB目安
    const v = cookieStore.get(PREFIX + i)?.value
    if (!v) break
    parts.push(v)
  }
  return parts.join("")
}

async function writeChunks(cookieStore: Awaited<ReturnType<typeof cookies>>, b64: string) {
  // 既存削除（多めに掃除）
  for (let i = 0; i < 50; i++) {
    cookieStore.set(PREFIX + i, "", { path: "/", maxAge: 0 })
  }
  // 分割書き込み
  let idx = 0
  for (let p = 0; p < b64.length; p += MAX_CHUNK) {
    const chunk = b64.slice(p, p + MAX_CHUNK)
    cookieStore.set(PREFIX + idx, chunk, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: "lax" as const,
      path: "/", 
      maxAge: 60 * 60 * 24 * 365, // 1年
    })
    idx++
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    console.log('📥 GET /api/state: Cookieから状態を読み込み中...')
    const cookieStore = await cookies()
    const b64 = await readChunks(cookieStore)
    
    if (!b64) {
      console.log('📥 GET /api/state: Cookieにデータなし')
      return NextResponse.json({ ok: true, data: null })
    }
    
    const json = Buffer.from(b64, "base64").toString("utf8")
    const data = JSON.parse(json)
    console.log('📥 GET /api/state: 復元完了')
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    console.error('❌ GET /api/state error:', error)
    return NextResponse.json({ ok: false, data: null }, { status: 400 })
  }
}

export async function POST(req: Request) {
  try {
    console.log('📤 POST /api/state: Cookieに状態を保存中...')
    const cookieStore = await cookies()
    const body = await req.json().catch(() => null)
    
    if (!body || typeof body !== "object") {
      console.error('❌ POST /api/state: 無効なリクエストボディ')
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    
    // body は { data: 任意のオブジェクト } を想定
    const json = JSON.stringify(body.data ?? null)
    const b64 = Buffer.from(json, "utf8").toString("base64")
    await writeChunks(cookieStore, b64)
    
    console.log('✅ POST /api/state: 保存完了')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ POST /api/state error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
