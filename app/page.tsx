import { prisma } from "@/lib/db";
import Link from "next/link";
import { MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function TopPage() {
  const [menus, settings] = await Promise.all([
    prisma.menu.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.businessSettings.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-[#e8e1d9] sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
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

      <main className="max-w-md mx-auto">
        {/* ヒーロー */}
        <section className="bg-gradient-to-br from-[#2d6a4f] to-[#3d8a6a] px-6 py-12 text-white text-center">
          <p className="text-sm font-medium opacity-80 mb-2">体の不調を根本から改善</p>
          <h2 className="text-3xl font-bold leading-tight mb-3">
            あなたの体を<br />ていねいにほぐします
          </h2>
          <p className="text-sm opacity-80 mb-8 leading-relaxed">
            {settings?.description ?? "経験豊富なスタッフが丁寧にカウンセリングし、最適な施術を提供します。"}
          </p>
          <Link
            href="/reserve"
            className="inline-flex items-center gap-2 bg-white text-[#2d6a4f] font-bold px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-transform text-lg"
          >
            予約する
            <ChevronRight size={20} />
          </Link>
        </section>

        {/* 営業情報 */}
        <section className="px-4 py-6">
          <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4 space-y-3">
            {settings?.address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-[#2d6a4f] mt-0.5 shrink-0" />
                <span className="text-[#5a4e45]">{settings.address}</span>
              </div>
            )}
            {settings?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#2d6a4f] shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-[#5a4e45]">{settings.phone}</a>
              </div>
            )}
            {settings && (
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-[#2d6a4f] shrink-0" />
                <span className="text-[#5a4e45]">
                  {settings.openTime} 〜 {settings.closeTime}（日曜定休）
                </span>
              </div>
            )}
          </div>
        </section>

        {/* メニュー・料金表 */}
        <section className="px-4 pb-6">
          <h3 className="text-xl font-bold text-[#2c2c2c] mb-4">施術メニュー</h3>
          <div className="space-y-3">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-2xl border border-[#e8e1d9] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {menu.category && (
                        <span className="text-xs bg-[#f0ebe4] text-[#5a4e45] px-2 py-0.5 rounded-full">
                          {menu.category}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-[#2c2c2c]">{menu.name}</h4>
                    {menu.description && (
                      <p className="text-sm text-[#8a7e72] mt-1 leading-relaxed">{menu.description}</p>
                    )}
                    <p className="text-xs text-[#8a7e72] mt-1">{menu.duration}分</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#2d6a4f] text-lg">{formatCurrency(menu.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 予約CTAフッター */}
        <div className="sticky bottom-0 bg-white border-t border-[#e8e1d9] px-4 py-3">
          <Link
            href="/reserve"
            className="flex items-center justify-center gap-2 bg-[#2d6a4f] text-white font-bold py-4 rounded-2xl text-lg w-full active:scale-95 transition-transform"
          >
            今すぐ予約する
            <ChevronRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
