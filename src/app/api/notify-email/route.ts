import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { to, subject, text, html } = body;

  if (!to) {
    return NextResponse.json({ ok: false, error: "no to" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
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
  return NextResponse.json({ ok: true, result: json });
}

