// 開発中: MAIL_MOCK=true の場合は console.log で代替
// 本番: MAIL_MOCK=false にして SMTP 設定を .env.local に追加する

interface ReservationMailData {
  to: string;
  customerName: string;
  menuName: string;
  staffName?: string;
  startTime: Date;
  endTime: Date;
  reservationId: string;
}

function formatDateTime(d: Date): string {
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendMail(to: string, subject: string, body: string) {
  if (process.env.MAIL_MOCK === "true" || !process.env.SMTP_HOST) {
    console.log("─── [MAIL MOCK] ─────────────────────");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log("─────────────────────────────────────");
    return;
  }

  // 本番用 (MAIL_MOCK=false + SMTP_HOST 設定済みの場合)
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@example.com",
    to,
    subject,
    text: body,
  });
}

export async function sendReservationConfirmed(data: ReservationMailData) {
  const subject = "【予約確定】ご予約ありがとうございます";
  const body = `${data.customerName} 様

ご予約が確定しました。

【予約内容】
施術メニュー: ${data.menuName}
担当スタッフ: ${data.staffName ?? "指名なし"}
日時: ${formatDateTime(data.startTime)}

ご来院をお待ちしております。
キャンセルはマイページからお手続きください。

───────────────
小川整体院
`;
  await sendMail(data.to, subject, body);
}

export async function sendReservationReminder(data: ReservationMailData) {
  const subject = "【前日リマインド】明日のご予約について";
  const body = `${data.customerName} 様

明日のご予約についてお知らせします。

【予約内容】
施術メニュー: ${data.menuName}
日時: ${formatDateTime(data.startTime)}

お時間になりましたらお越しください。

───────────────
小川整体院
`;
  await sendMail(data.to, subject, body);
}

export async function sendReservationCancelled(data: ReservationMailData) {
  const subject = "【キャンセル完了】ご予約をキャンセルしました";
  const body = `${data.customerName} 様

以下のご予約をキャンセルしました。

施術メニュー: ${data.menuName}
日時: ${formatDateTime(data.startTime)}

またのご利用をお待ちしております。

───────────────
小川整体院
`;
  await sendMail(data.to, subject, body);
}
