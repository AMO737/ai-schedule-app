import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, text, html } = body;

    if (!to) {
      return NextResponse.json({ ok: false, error: "no to" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[notify-email] RESEND_API_KEY not found")
      return NextResponse.json({ ok: false, error: "no api key" }, { status: 500 });
    }

    const emailFrom = process.env.EMAIL_FROM || "Study App <noreply@yourapp.com>";

    // Resendに送る
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to,
        subject: subject ?? "学習リマインド",
        text: text ?? "学習の時間です。",
        html: html ?? "<p>学習の時間です。</p>",
      }),
    });

    const json = await res.json();
    
    if (!res.ok) {
      console.error("[notify-email] Resend API error:", json)
      return NextResponse.json({ ok: false, error: "Resend API error", details: json }, { status: 500 });
    }
    
    console.log("[notify-email] Email sent successfully:", json.id)
    return NextResponse.json({ ok: true, result: json });
  } catch (error) {
    console.error("[notify-email] Unexpected error:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 }
    );
  }
}

