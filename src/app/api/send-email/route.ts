import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json()

    // メール送信の実装
    // 実際のプロダクション環境では、SendGrid、Mailgun、AWS SESなどのサービスを使用
    // ここではシミュレーションとして、コンソールに出力
    
    console.log('📧 メール送信シミュレーション:')
    console.log('宛先:', email)
    console.log('件名:', subject)
    console.log('本文:', message)

    // 実際のメール送信サービスを使用する場合の例（コメントアウト）
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }]
        }],
        from: { email: 'noreply@yourapp.com' },
        subject,
        content: [{
          type: 'text/html',
          value: message
        }]
      })
    })
    */

    return NextResponse.json({ 
      success: true, 
      message: 'メールを送信しました（シミュレーション）' 
    })
  } catch (error) {
    console.error('メール送信エラー:', error)
    return NextResponse.json(
      { success: false, error: 'メール送信に失敗しました' },
      { status: 500 }
    )
  }
}
