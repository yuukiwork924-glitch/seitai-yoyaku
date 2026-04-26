import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, ChevronRight, ChevronDown, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function TopPage() {
  const [menus, settings] = await Promise.all([
    prisma.menu.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.businessSettings.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ─── HEADER ─── */}
      <header className="bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8DDD0] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="font-serif text-base font-bold text-[#2C1F14] tracking-wide">小川クリニック</p>
          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="text-sm text-[#6B5744] hover:text-[#8C6239] px-4 py-2 rounded-lg hover:bg-[#F2EBE1] transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/mypage"
              className="text-sm text-[#6B5744] hover:text-[#8C6239] px-4 py-2 rounded-lg hover:bg-[#F2EBE1] transition-colors"
            >
              マイページ
            </Link>
            <Link
              href="/reserve"
              className="text-sm bg-[#8C6239] text-white px-5 py-2 rounded-lg hover:bg-[#7a5430] transition-colors ml-2"
            >
              予約する
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ─── HERO ─── */}
        <section className="relative h-screen min-h-[600px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&auto=format&fit=crop"
            alt="温かみのある施術の様子"
            width={1400}
            height={900}
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C1F14]/60 to-[#2C1F14]/20" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-xs tracking-[0.2em] text-[#D4A882] uppercase mb-6 font-medium">
              Ogawa Clinic — Premium Bodywork
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-snug mb-6">
              あなたの体を<br />ていねいにほぐします
            </h1>
            <div className="w-16 h-px bg-[#C8956B] mx-auto mb-8" />
            <Link
              href="/reserve"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-10 py-4 rounded-none text-sm font-medium tracking-widest hover:bg-white hover:text-[#2C1F14] transition-all duration-300"
            >
              ご予約はこちら
            </Link>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown size={24} className="text-white/60" />
            </div>
          </div>
        </section>

        {/* ─── PHILOSOPHY ─── */}
        <section className="py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-xs tracking-[0.2em] text-[#C8956B] uppercase mb-4">Philosophy</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1F14] mb-4">
              体と心のバランスを整える
            </h2>
            <div className="w-12 h-0.5 bg-[#8C6239] mx-auto mt-3 mb-8" />
            <p className="text-[#6B5744] leading-relaxed text-base max-w-2xl mx-auto">
              私たちは「体の不調を根本から改善する」をモットーに、お一人おひとりに合わせた施術をご提供しています。
              丁寧なカウンセリングを通じて痛みの原因を見極め、再発しない体づくりをともに目指します。
              忙しい日常の中に、ほっと息をつける時間をお届けします。
            </p>
            <div className="w-full h-px bg-[#E8DDD0] mt-16" />
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-0">
              {/* Image — 55% */}
              <div className="w-full md:w-[55%] relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&auto=format&fit=crop"
                  alt="清潔感のある施術室の内装"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text — 45%, overlapping slightly on PC */}
              <div className="w-full md:w-[45%] bg-[#FAF7F2] md:-ml-12 md:mt-12 md:mb-12 z-10 p-10 md:p-14 flex flex-col justify-center shadow-sm">
                <p className="text-xs tracking-[0.2em] text-[#C8956B] uppercase mb-4">About Us</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1F14] leading-snug mb-2">
                  小川クリニックについて
                </h2>
                <div className="w-12 h-0.5 bg-[#8C6239] mt-3 mb-6" />
                <p className="text-[#6B5744] leading-relaxed mb-8 text-sm">
                  地域に根ざした整体院として、15年以上の施術経験を積んでまいりました。
                  丁寧なヒアリングと確かな技術で、多くの方の体のお悩みを解決してきた実績があります。
                </p>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="font-serif text-3xl font-bold text-[#8C6239]">15<span className="text-base font-sans">年+</span></p>
                    <p className="text-xs text-[#6B5744] mt-1">施術歴</p>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-3xl font-bold text-[#8C6239]">3,000<span className="text-base font-sans">+</span></p>
                    <p className="text-xs text-[#6B5744] mt-1">累計来院数</p>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-3xl font-bold text-[#8C6239]">92<span className="text-base font-sans">%</span></p>
                    <p className="text-xs text-[#6B5744] mt-1">リピート率</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SERVICES ─── */}
        <section className="bg-[#FAF7F2] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.2em] text-[#C8956B] uppercase mb-4">Menu</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1F14]">施術メニュー</h2>
              <div className="w-12 h-0.5 bg-[#8C6239] mx-auto mt-3 mb-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white border border-[#E8DDD0] border-l-4 border-l-[#C8956B] p-7 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-[#2C1F14] text-lg leading-snug mb-2">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-sm text-[#6B5744] leading-relaxed mb-3">{menu.description}</p>
                      )}
                      <p className="text-xs text-[#6B5744] flex items-center gap-1">
                        <Clock size={11} />{menu.duration}分
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#8C6239] text-2xl">{formatCurrency(menu.price)}</p>
                      <p className="text-[10px] text-[#6B5744] mt-0.5">税込</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/reserve"
                className="inline-flex items-center gap-2 bg-[#8C6239] text-white px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#7a5430] transition-colors"
              >
                ご予約する
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── STAFF ─── */}
        <section className="bg-[#F2EBE1] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.2em] text-[#C8956B] uppercase mb-4">Therapist</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1F14]">スタッフ紹介</h2>
              <div className="w-12 h-0.5 bg-[#8C6239] mx-auto mt-3 mb-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Staff 1 */}
              <div className="bg-white p-8 flex flex-col items-center text-center shadow-sm">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#8C6239] to-[#C8956B] flex items-center justify-center mb-6 shadow-sm">
                  <span className="font-serif text-4xl font-bold text-white">田</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C1F14] mb-1">田中 健二</h3>
                <p className="text-xs text-[#6B5744] mb-4">整体師・院長</p>
                <p className="text-sm text-[#6B5744] leading-relaxed">
                  15年以上の施術経験を持つ整体師。腰痛・肩こりの根本改善を得意とし、丁寧なカウンセリングで多くの方に喜ばれています。
                </p>
              </div>

              {/* Staff 2 */}
              <div className="bg-white p-8 flex flex-col items-center text-center shadow-sm">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#C8956B] to-[#D4A882] flex items-center justify-center mb-6 shadow-sm">
                  <span className="font-serif text-4xl font-bold text-white">佐</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C1F14] mb-1">佐藤 美咲</h3>
                <p className="text-xs text-[#6B5744] mb-4">鍼灸師・リラクゼーション担当</p>
                <p className="text-sm text-[#6B5744] leading-relaxed">
                  鍼灸師の資格を持ち、全身リラクゼーションと美容鍼を専門とします。心と体のバランスを整えるトリートメントが得意です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.2em] text-[#C8956B] uppercase mb-4">Voice</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1F14]">お客様の声</h2>
              <div className="w-12 h-0.5 bg-[#8C6239] mx-auto mt-3 mb-0" />
            </div>

            {/* Mobile: horizontal scroll / PC: 3-col grid */}
            <div className="flex gap-5 overflow-x-auto pb-2 -mx-2 px-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
              {[
                {
                  name: "山田さん",
                  text: "長年悩んでいた腰痛が、3回の施術でかなり楽になりました。田中先生の丁寧なカウンセリングに安心感を覚え、今では月2回通っています。",
                },
                {
                  name: "鈴木さん",
                  text: "肩こりがひどくて睡眠も浅かったのですが、施術後は体がとても軽くなりました。スタッフの方々がとても親切で、また来たいと思える素敵なクリニックです。",
                },
                {
                  name: "田中さん",
                  text: "デスクワークで猫背が気になっていましたが、姿勢矯正のメニューを試したところ見違えるほど改善。完全予約制なので待ち時間もなく快適です。",
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="min-w-[280px] md:min-w-0 border border-[#E8DDD0] p-8 flex flex-col"
                >
                  <span className="font-serif text-5xl text-[#C8956B] leading-none mb-4 select-none">&ldquo;</span>
                  <p className="text-sm text-[#6B5744] leading-relaxed flex-1 mb-6">{review.text}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#2C1F14]">{review.name}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="bg-[#2C1F14] py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="font-serif text-2xl font-bold text-white mb-4">小川クリニック</p>
            {settings?.address && (
              <p className="text-sm text-white/70 flex items-center justify-center gap-1.5 mb-1">
                <MapPin size={13} />
                {settings.address}
              </p>
            )}
            {settings?.phone && (
              <p className="text-sm text-white/70 flex items-center justify-center gap-1.5 mb-1">
                <Phone size={13} />
                {settings.phone}
              </p>
            )}
            {settings && (
              <p className="text-sm text-white/70 flex items-center justify-center gap-1.5 mb-6">
                <Clock size={13} />
                {settings.openTime} 〜 {settings.closeTime}（日曜定休）
              </p>
            )}
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} 小川クリニック. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* ─── STICKY CTA (mobile only) ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#E8DDD0] px-4 py-3 z-20 md:hidden">
        <Link
          href="/reserve"
          className="flex items-center justify-center gap-2 bg-[#8C6239] text-white font-bold py-4 rounded-none text-base w-full active:scale-[0.97] transition-all"
        >
          今すぐ予約する
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
