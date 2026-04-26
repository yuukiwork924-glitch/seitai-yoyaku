import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, ChevronRight, CalendarCheck, MessageCircle, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_BORDER: Record<string, string> = {
  全身: "border-l-emerald-500",
  部分: "border-l-blue-400",
  矯正: "border-l-purple-400",
};

export default async function TopPage() {
  const [menus, settings] = await Promise.all([
    prisma.menu.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.businessSettings.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[#e8e1d9] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#2d6a4f] font-serif tracking-wide">小川クリニック</h1>
          <div className="flex gap-2">
            <Link href="/login" className="text-sm text-[#5a4e45] hover:text-[#2d6a4f] px-3 py-1.5 rounded-lg hover:bg-[#f0ebe4] transition-colors">
              ログイン
            </Link>
            <Link href="/mypage" className="text-sm text-[#5a4e45] hover:text-[#2d6a4f] px-3 py-1.5 rounded-lg hover:bg-[#f0ebe4] transition-colors">
              マイページ
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ヒーロー — full-width photo with overlay */}
        <section className="relative h-[88vh] min-h-[560px] max-h-[800px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format&fit=crop"
            alt="温かみのある施術の様子"
            width={1200}
            height={800}
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d6a4f]/80 to-[#1a3d2e]/60" />

          <div className="relative h-full flex items-center">
            <div className="max-w-5xl mx-auto px-6 w-full">
              <div className="max-w-lg text-center md:text-left">
                <p className="text-sm font-medium text-white/75 mb-3 tracking-widest uppercase">Ogawa Clinic</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold leading-snug text-white mb-4">
                  あなたの体を<br />ていねいにほぐします
                </h2>
                <p className="text-base text-white/80 mb-8 leading-relaxed">
                  {settings?.description ?? "経験豊富なスタッフが丁寧にカウンセリングし、最適な施術を提供します。"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="/reserve"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#2d6a4f] font-bold px-8 py-4 rounded-2xl shadow-lg active:scale-[0.97] transition-all text-base hover:shadow-xl"
                  >
                    今すぐ予約する
                    <ChevronRight size={18} />
                  </Link>
                  <a
                    href={settings?.phone ? `tel:${settings.phone}` : "#"}
                    className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/30 font-medium px-6 py-4 rounded-2xl transition-all hover:bg-white/25 text-base"
                  >
                    <Phone size={16} />
                    {settings?.phone ?? "お電話でのご予約"}
                  </a>
                </div>
              </div>

              {/* Business info strip at bottom */}
              {settings && (
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-0 md:right-0 md:static md:mt-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex flex-wrap gap-4 text-white/85 text-xs md:text-sm md:w-fit">
                    {settings.address && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {settings.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {settings.openTime} 〜 {settings.closeTime}（日曜定休）
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            {/* Image */}
            <div className="md:w-1/2 relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?w=800&auto=format&fit=crop"
                alt="清潔感のある施術室の内装"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            {/* Text */}
            <div className="md:w-1/2">
              <p className="text-xs font-medium tracking-widest text-[#2d6a4f] uppercase mb-3">About Us</p>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#2c2c2c] leading-snug mb-3">
                小川クリニックについて
              </h3>
              <div className="w-12 h-0.5 bg-[#2d6a4f] mb-6" />
              <p className="text-[#5a4e45] leading-relaxed mb-4">
                私たちは「体の不調を根本から改善する」をモットーに、お一人おひとりに合わせたオーダーメイドの施術をご提供しています。
              </p>
              <p className="text-[#5a4e45] leading-relaxed mb-6">
                丁寧なカウンセリングを通じて、痛みの原因を見極め、再発しない体づくりをともに目指します。
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="font-serif text-3xl font-bold text-[#2d6a4f]">1,200<span className="text-base font-sans">+</span></p>
                  <p className="text-xs text-[#8a7e72] mt-1">累計施術件数</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-[#2d6a4f]">98<span className="text-base font-sans">%</span></p>
                  <p className="text-xs text-[#8a7e72] mt-1">顧客満足度</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-[#2d6a4f]">5<span className="text-base font-sans">年</span></p>
                  <p className="text-xs text-[#8a7e72] mt-1">地域での実績</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴 3列 */}
        <section className="bg-white py-14">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-xs font-medium tracking-widest text-[#2d6a4f] uppercase text-center mb-2">Features</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2c2c2c] text-center mb-10">選ばれる3つの理由</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {[
                {
                  icon: CalendarCheck,
                  title: "完全予約制",
                  desc: "待ち時間ゼロ。ご予約のお時間にすぐご案内します。",
                  color: "text-[#2d6a4f]",
                  bg: "bg-emerald-50",
                  accent: "border-t-[#2d6a4f]",
                },
                {
                  icon: MessageCircle,
                  title: "丁寧なカウンセリング",
                  desc: "お体の状態をしっかりヒアリングし、最適な施術をご提案。",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                  accent: "border-t-blue-400",
                },
                {
                  icon: Star,
                  title: "ポイント還元",
                  desc: "施術ごとにポイントが貯まります。次回のご来院にお使いください。",
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                  accent: "border-t-amber-400",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`min-w-[240px] md:min-w-0 bg-white rounded-2xl border border-[#e8e1d9] border-t-4 ${feature.accent} p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center`}>
                      <Icon size={24} className={feature.color} />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-[#2c2c2c] text-base mb-2">{feature.title}</p>
                      <p className="text-sm text-[#8a7e72] leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* スタッフ紹介 */}
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <p className="text-xs font-medium tracking-widest text-[#2d6a4f] uppercase text-center mb-2">Our Team</p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2c2c2c] text-center mb-10">スタッフ紹介</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff 1 */}
            <div className="bg-white rounded-3xl border border-[#e8e1d9] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center mb-5 shadow-md">
                <span className="font-serif text-4xl font-bold text-white">田</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-[#2c2c2c] mb-1">田中 健二</h4>
              <span className="text-xs bg-emerald-50 text-[#2d6a4f] px-3 py-1 rounded-full font-medium mb-3">整体師・院長</span>
              <p className="text-sm text-[#8a7e72] leading-relaxed">
                15年以上の施術経験を持つ整体師。腰痛・肩こりの根本改善を得意とし、丁寧なカウンセリングで多くの方に喜ばれています。
              </p>
            </div>
            {/* Staff 2 */}
            <div className="bg-white rounded-3xl border border-[#e8e1d9] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#d4845a] to-[#f4a261] flex items-center justify-center mb-5 shadow-md">
                <span className="font-serif text-4xl font-bold text-white">佐</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-[#2c2c2c] mb-1">佐藤 美咲</h4>
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium mb-3">鍼灸師・リラクゼーション担当</span>
              <p className="text-sm text-[#8a7e72] leading-relaxed">
                鍼灸師の資格を持ち、全身リラクゼーションと美容鍼を専門とします。心と体のバランスを整えるトリートメントが得意です。
              </p>
            </div>
          </div>
        </section>

        {/* メニュー */}
        <section className="bg-white py-14">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-xs font-medium tracking-widest text-[#2d6a4f] uppercase mb-2">Menu</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2c2c2c] mb-8">施術メニュー</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menus.map((menu) => {
                const borderColor = menu.category ? (CATEGORY_BORDER[menu.category] ?? "border-l-[#d5cfc9]") : "border-l-[#d5cfc9]";
                return (
                  <div
                    key={menu.id}
                    className={`bg-[#faf8f5] rounded-2xl border border-[#e8e1d9] border-l-4 ${borderColor} p-5 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {menu.category && (
                          <span className="text-xs bg-[#f0ebe4] text-[#5a4e45] px-2 py-0.5 rounded-full font-medium">
                            {menu.category}
                          </span>
                        )}
                        <h4 className="font-serif font-bold text-[#2c2c2c] text-base mt-2">{menu.name}</h4>
                        {menu.description && (
                          <p className="text-sm text-[#8a7e72] mt-1 leading-relaxed">{menu.description}</p>
                        )}
                        <p className="text-xs text-[#8a7e72] mt-2 flex items-center gap-1">
                          <Clock size={11} />{menu.duration}分
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[#2d6a4f] text-xl">{formatCurrency(menu.price)}</p>
                        <p className="text-[10px] text-[#8a7e72]">税込</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* お客様の声 */}
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <p className="text-xs font-medium tracking-widest text-[#2d6a4f] uppercase text-center mb-2">Reviews</p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2c2c2c] text-center mb-10">お客様の声</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "山田様",
                text: "長年悩んでいた腰痛が、3回の施術でかなり楽になりました。田中先生の丁寧なカウンセリングに安心感を覚え、今では月2回通っています。",
              },
              {
                name: "鈴木様",
                text: "肩こりがひどくて睡眠も浅かったのですが、施術後は体がとても軽くなりました。スタッフの方々がとても親切で、また来たいと思える素敵なクリニックです。",
              },
              {
                name: "田中様",
                text: "デスクワークで猫背が気になっていましたが、姿勢矯正のメニューを試したところ見違えるほど改善。完全予約制なので待ち時間もなく快適です。",
              },
            ].map((review) => (
              <div key={review.name} className="bg-white rounded-3xl border border-[#e8e1d9] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <span className="font-serif text-5xl text-[#2d6a4f]/20 leading-none mb-2 select-none">&ldquo;</span>
                <p className="text-sm text-[#5a4e45] leading-relaxed flex-1 mb-5">{review.text}</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#2c2c2c] text-sm">{review.name}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* フッター */}
        <footer className="bg-[#1a3d2e] text-white/70 py-10">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-serif text-xl font-bold text-white mb-2">小川クリニック</p>
            {settings?.address && <p className="text-sm mb-1">{settings.address}</p>}
            {settings?.phone && <p className="text-sm mb-4">{settings.phone}</p>}
            <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} 小川クリニック. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* 予約CTAフッター（Sticky） */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#e8e1d9] px-4 py-3 z-20">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/reserve"
            className="flex items-center justify-center gap-2 bg-[#2d6a4f] text-white font-bold py-4 rounded-2xl text-lg w-full active:scale-[0.97] transition-all md:max-w-sm md:mx-auto hover:bg-[#245a41]"
          >
            今すぐ予約する
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
