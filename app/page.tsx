import { prisma } from "@/lib/db";
import Link from "next/link";
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
      <header className="bg-white border-b border-[#e8e1d9] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#2d6a4f]">小川クリニック</h1>
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
        {/* ヒーロー */}
        <section className="relative bg-gradient-to-br from-[#2d6a4f] to-[#3d8a6a] text-white overflow-hidden">
          {/* Decorative blobs (CSS only) */}
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-60px] left-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 right-[15%] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-center md:gap-16">
            {/* テキスト */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-medium opacity-80 mb-2 tracking-wide">体の不調を根本から改善</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                あなたの体を<br />ていねいにほぐします
              </h2>
              <p className="text-sm opacity-80 mb-8 leading-relaxed">
                {settings?.description ?? "経験豊富なスタッフが丁寧にカウンセリングし、最適な施術を提供します。"}
              </p>
              <Link
                href="/reserve"
                className="inline-flex items-center gap-2 bg-white text-[#2d6a4f] font-bold px-8 py-4 rounded-2xl shadow-lg active:scale-[0.97] transition-all text-lg hover:shadow-xl"
              >
                今すぐ予約する
                <ChevronRight size={20} />
              </Link>
            </div>

            {/* 営業情報カード */}
            <div className="mt-8 md:mt-0 md:w-72 shrink-0">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 space-y-3">
                <p className="font-bold text-sm">営業情報</p>
                {settings?.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={15} className="shrink-0 mt-0.5 opacity-80" />
                    <span className="opacity-90">{settings.address}</span>
                  </div>
                )}
                {settings?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={15} className="shrink-0 opacity-80" />
                    <a href={`tel:${settings.phone}`} className="opacity-90">{settings.phone}</a>
                  </div>
                )}
                {settings && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={15} className="shrink-0 opacity-80" />
                    <span className="opacity-90">{settings.openTime} 〜 {settings.closeTime}（日曜定休）</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 特徴 3列 */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          {/* Mobile: horizontal scroll, PC: 3-col grid */}
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {[
              {
                icon: CalendarCheck,
                title: "完全予約制",
                desc: "待ち時間ゼロ。ご予約のお時間にすぐご案内します。",
                color: "text-[#2d6a4f]",
                bg: "bg-emerald-50",
              },
              {
                icon: MessageCircle,
                title: "丁寧なカウンセリング",
                desc: "お体の状態をしっかりヒアリングし、最適な施術をご提案。",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                icon: Star,
                title: "ポイント還元",
                desc: "施術ごとにポイントが貯まります。次回のご来院にお使いください。",
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="min-w-[220px] md:min-w-0 bg-white rounded-2xl border border-[#e8e1d9] p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 ${feature.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} className={feature.color} />
                  </div>
                  <div>
                    <p className="font-bold text-[#2c2c2c] text-sm mb-1">{feature.title}</p>
                    <p className="text-xs text-[#8a7e72] leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* メニュー */}
        <section className="max-w-5xl mx-auto px-4 pb-28">
          <h3 className="text-xl font-bold text-[#2c2c2c] mb-5">施術メニュー</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menus.map((menu) => {
              const borderColor = menu.category ? (CATEGORY_BORDER[menu.category] ?? "border-l-[#d5cfc9]") : "border-l-[#d5cfc9]";
              return (
                <div
                  key={menu.id}
                  className={`bg-white rounded-2xl border border-[#e8e1d9] border-l-4 ${borderColor} p-5 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {menu.category && (
                        <span className="text-xs bg-[#f0ebe4] text-[#5a4e45] px-2 py-0.5 rounded-full font-medium">
                          {menu.category}
                        </span>
                      )}
                      <h4 className="font-bold text-[#2c2c2c] text-base mt-2">{menu.name}</h4>
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
        </section>

        {/* 予約CTAフッター */}
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
      </main>
    </div>
  );
}
