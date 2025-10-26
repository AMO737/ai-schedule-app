import { cookies } from "next/headers"

const PREFIX = "state_v1_"

/**
 * 分割されたCookieを結合して復元
 */
export function reconstructCookieState(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  try {
    let parts: string[] = []
    for (let i = 0; i < 50; i++) {
      const v = cookieStore.get(PREFIX + i)?.value
      if (!v) break
      parts.push(v)
    }
    
    if (parts.length === 0) return null
    
    const b64 = parts.join("")
    const json = Buffer.from(b64, "base64").toString("utf8")
    return JSON.parse(json)
  } catch (error) {
    console.error('Cookie reconstruction error:', error)
    return null
  }
}
