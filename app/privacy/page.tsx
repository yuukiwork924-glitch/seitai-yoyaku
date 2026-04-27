import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "プライバシーポリシー | 小川整体院",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <header className="bg-white border-b border-[#DDD9D2] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 text-[#7A7570] hover:text-[#2B3A52] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <p className="font-serif text-base font-bold text-[#2B3A52]">プライバシーポリシー</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 pb-20">
        <div className="bg-white border border-[#DDD9D2] p-8 md:p-12 space-y-10 text-[#2A2A2A]">

          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2B3A52] mb-2">プライバシーポリシー</h1>
            <p className="text-sm text-[#7A7570]">小川整体院（以下「当院」）は、お客様の個人情報の保護を重要な責務と考え、以下のとおりプライバシーポリシーを定めます。</p>
          </div>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">1. 取得する個人情報</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">当院は、以下の個人情報を取得することがあります。</p>
            <ul className="text-sm text-[#4A4A4A] leading-relaxed space-y-1 pl-5 list-disc">
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>電話番号</li>
              <li>生年月日・性別・職業</li>
              <li>既往歴・服薬情報・アレルギー情報（初回問診票）</li>
              <li>ご予約・施術に関する情報</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">2. 利用目的</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">取得した個人情報は、以下の目的のみに使用します。</p>
            <ul className="text-sm text-[#4A4A4A] leading-relaxed space-y-1 pl-5 list-disc">
              <li>予約の受付・管理・確認のご連絡</li>
              <li>施術に関するカウンセリングおよび施術記録の管理</li>
              <li>ポイントサービスの提供</li>
              <li>お問い合わせへの対応</li>
              <li>サービスの改善および新サービスの開発</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">3. 第三者への提供</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">当院は、以下の場合を除き、お客様の個人情報を第三者に提供・開示しません。</p>
            <ul className="text-sm text-[#4A4A4A] leading-relaxed space-y-1 pl-5 list-disc">
              <li>お客様ご本人の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護に必要な場合</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">4. 委託</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">当院は、利用目的の達成に必要な範囲内で、個人情報の取り扱いを外部に委託する場合があります。その際は、委託先に対して適切な管理・監督を行います。</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">5. 安全管理</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">当院は、個人情報への不正アクセス・紛失・破壊・改ざん・漏えいを防止するため、適切な安全管理措置を講じます。また、個人情報を取り扱うスタッフに対して必要な教育・監督を行います。</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">6. 開示・訂正・削除のご請求</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">お客様は、当院が保有する自己の個人情報について、開示・訂正・削除・利用停止を請求することができます。ご請求の際は、本人確認を行った上で、合理的な期間内に対応します。お問い合わせは下記までご連絡ください。</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">7. Cookie・アクセス解析</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">当院のウェブサイトでは、サービス改善のためにアクセス解析ツールを使用する場合があります。これらのツールはCookieを利用してアクセス情報を収集しますが、個人を特定する情報は含みません。ブラウザの設定によりCookieを無効にすることが可能です。</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">8. プライバシーポリシーの変更</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">当院は、法令の変更やサービス内容の変化に応じて、本ポリシーを改定することがあります。重要な変更がある場合は、当院ウェブサイト上でお知らせします。</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-[#2B3A52] text-base border-l-4 border-[#5C7FA3] pl-3">9. お問い合わせ</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。</p>
            <div className="text-sm text-[#4A4A4A] leading-loose bg-[#F7F4EE] border border-[#DDD9D2] p-4">
              <p className="font-medium text-[#2B3A52]">小川整体院</p>
              <p>個人情報保護担当窓口</p>
              <p>受付時間：営業時間内</p>
            </div>
          </section>

          <p className="text-xs text-[#7A7570] pt-4 border-t border-[#DDD9D2]">制定日：2024年1月1日</p>
        </div>
      </main>
    </div>
  );
}
