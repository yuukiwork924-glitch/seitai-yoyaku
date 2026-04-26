import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, ChevronRight, Check, Activity, Brain, Zap, AlignCenter, Heart, Dumbbell, Monitor, Wind } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SYMPTOMS = [
  { Icon: Activity,     label: "腰痛・ぎっくり腰", en: "Low Back Pain" },
  { Icon: Wind,         label: "肩こり・首こり",   en: "Shoulder Stiffness" },
  { Icon: Brain,        label: "頭痛・偏頭痛",     en: "Headache" },
  { Icon: Zap,          label: "坐骨神経痛",       en: "Sciatica" },
  { Icon: AlignCenter,  label: "猫背・姿勢改善",   en: "Posture Care" },
  { Icon: Heart,        label: "産後ケア",         en: "Postnatal Care" },
  { Icon: Dumbbell,     label: "スポーツ障害",     en: "Sports Injury" },
  { Icon: Monitor,      label: "テレワーク疲れ",   en: "Work Fatigue" },
];

const REASONS = [
  {
    num: "01",
    title: "根本改善へのアプローチ",
    body: "痛みの出ている場所だけでなく、原因となる筋骨格のバランスを整え、再発しにくい体づくりを目指します。",
  },
  {
    num: "02",
    title: "丁寧なカウンセリング",
    body: "初回は問診・姿勢分析に十分な時間を確保。お体の状態を正確に把握した上で施術方針をご説明します。",
  },
  {
    num: "03",
    title: "完全予約制・個室対応",
    body: "待ち時間なし、プライベート空間でリラックスして施術を受けていただけます。",
  },
  {
    num: "04",
    title: "15年以上の施術実績",
    body: "累計3,000名以上のお客様を担当。幅広い症状に対応できる確かな技術と経験があります。",
  },
];

const STEPS = [
  { step: "01", title: "ご予約", body: "お電話またはWEBから24時間受付。初めての方も安心してご連絡ください。" },
  { step: "02", title: "問診・カウンセリング", body: "お体の状態・お悩み・生活習慣などをヒアリング。施術方針をご説明します。" },
  { step: "03", title: "施術", body: "一人ひとりに合わせたオーダーメイドの整体施術を行います。" },
  { step: "04", title: "アフターケア", body: "施術後のセルフケア方法をお伝えし、次回の施術プランをご提案します。" },
];

export default async function TopPage() {
  const [menus, settings] = await Promise.all([
    prisma.menu.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.businessSettings.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F4EE]">

      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-[#DDD9D2] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg font-bold text-[#2B3A52] leading-none">小川整体院</p>
            <p className="text-[10px] text-[#7A7570] tracking-wide mt-0.5">Ogawa Seitai — 根本から改善する整体</p>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/login" className="hidden md:flex text-sm text-[#7A7570] hover:text-[#2B3A52] px-3 py-2 transition-colors">ログイン</Link>
            <Link href="/mypage" className="hidden md:flex text-sm text-[#7A7570] hover:text-[#2B3A52] px-3 py-2 transition-colors">マイページ</Link>
            <Link
              href="/reserve"
              className="hidden md:flex items-center gap-1.5 bg-[#2B3A52] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#1e2d42] transition-colors ml-2"
            >
              ネット予約
            </Link>
            <Link href="/mypage" className="md:hidden text-sm text-[#7A7570] px-2 py-2 transition-colors">マイページ</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ─── HERO ─── */}
        <section className="relative h-[100svh] min-h-[580px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1699523229487-bddb965a3307?w=1400&auto=format&fit=crop"
            alt="白衣の施術者による本格整体"
            width={1400}
            height={2097}
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B2940]/80 via-[#1B2940]/50 to-transparent" />

          <div className="relative h-full flex flex-col justify-center px-6 md:px-16 max-w-6xl mx-auto">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C7FA3]" />
                <span className="text-xs text-white/90 tracking-widest font-medium">完全予約制・個室施術</span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                痛みの根本から<br />改善する整体
              </h1>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
                腰痛・肩こり・頭痛など、<br className="md:hidden" />お体のお悩みを丁寧に診ます。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/reserve"
                  className="inline-flex items-center justify-center gap-2 bg-[#2B3A52] text-white font-bold px-8 py-4 text-sm hover:bg-[#1e2d42] transition-colors"
                >
                  ネット予約（24時間受付）
                  <ChevronRight size={16} />
                </Link>
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/70 text-white font-medium px-8 py-4 text-sm hover:bg-white/10 transition-colors"
                  >
                    <Phone size={15} />
                    {settings.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── お悩み症状 ─── */}
        <section className="bg-[#2B3A52] py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-[#5C7FA3] text-xs tracking-[0.2em] uppercase mb-2">Symptoms</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">こんなお悩みはありませんか？</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SYMPTOMS.map((s) => (
                <Link
                  key={s.label}
                  href="/reserve"
                  className="border border-white/15 hover:border-[#5C7FA3]/70 hover:bg-white/5 p-5 md:p-6 text-center transition-all duration-200 group"
                >
                  <s.Icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-[#5C7FA3] mx-auto mb-3 group-hover:text-[#93BDD4] transition-colors"
                  />
                  <p className="text-white text-sm font-medium group-hover:text-[#93BDD4] transition-colors leading-snug">{s.label}</p>
                  <p className="text-white/35 text-[10px] mt-1.5 tracking-widest uppercase">{s.en}</p>
                </Link>
              ))}
            </div>
            <p className="text-center text-white/60 text-xs mt-6">上記以外のお悩みもお気軽にご相談ください</p>
          </div>
        </section>

        {/* ─── 選ばれる理由 ─── */}
        <section className="py-20 md:py-28 bg-[#F7F4EE]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-[#5C7FA3] text-xs tracking-[0.2em] uppercase mb-3">Why Choose Us</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2B3A52]">選ばれる理由</h2>
              <div className="w-10 h-0.5 bg-[#5C7FA3] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REASONS.map((r) => (
                <div key={r.num} className="bg-white border border-[#DDD9D2] p-8 flex gap-5">
                  <div className="shrink-0">
                    <p className="font-serif text-3xl font-bold text-[#DDD9D2] leading-none">{r.num}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B3A52] text-base mb-2">{r.title}</h3>
                    <p className="text-sm text-[#7A7570] leading-relaxed">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 施術メニュー ─── */}
        <section className="bg-[#ECEAE4] py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#5C7FA3] text-xs tracking-[0.2em] uppercase mb-3">Menu & Price</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2B3A52]">施術メニュー・料金</h2>
              <div className="w-10 h-0.5 bg-[#5C7FA3] mx-auto mt-4" />
            </div>
            <div className="space-y-3">
              {menus.map((menu) => (
                <div key={menu.id} className="bg-white border border-[#DDD9D2] border-l-4 border-l-[#2B3A52] p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2B3A52] text-base mb-1">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-sm text-[#7A7570] leading-relaxed">{menu.description}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <Clock size={12} className="text-[#5C7FA3]" />
                        <span className="text-xs text-[#7A7570]">{menu.duration}分</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#2B3A52] text-2xl">{formatCurrency(menu.price)}</p>
                      <p className="text-[10px] text-[#7A7570] mt-0.5">税込</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/reserve" className="inline-flex items-center gap-2 bg-[#2B3A52] text-white font-bold px-10 py-4 text-sm hover:bg-[#1e2d42] transition-colors">
                このメニューで予約する
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 来院の流れ ─── */}
        <section className="py-20 md:py-28 bg-[#F7F4EE]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-[#5C7FA3] text-xs tracking-[0.2em] uppercase mb-3">Flow</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2B3A52]">来院の流れ</h2>
              <div className="w-10 h-0.5 bg-[#5C7FA3] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STEPS.map((s, i) => (
                <div key={s.step} className="relative text-center">
                  <div className="w-14 h-14 rounded-full bg-[#2B3A52] flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-white font-bold text-lg">{s.step}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-[-50%] h-px bg-[#DDD9D2]" />
                  )}
                  <h3 className="font-bold text-[#2B3A52] text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-[#7A7570] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── スタッフ ─── */}
        <section className="bg-[#ECEAE4] py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#5C7FA3] text-xs tracking-[0.2em] uppercase mb-3">Staff</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2B3A52]">スタッフ紹介</h2>
              <div className="w-10 h-0.5 bg-[#5C7FA3] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  initial: "田",
                  name: "田中 健二",
                  role: "整体師・院長",
                  certs: ["整体師認定資格", "スポーツトレーナー"],
                  bio: "腰痛・肩こりの根本改善を得意とし、15年以上の施術経験を持つ。丁寧なカウンセリングと確かな手技で、多くの方の体のお悩みを解決してきました。",
                },
                {
                  initial: "佐",
                  name: "佐藤 美咲",
                  role: "鍼灸師・整体師",
                  certs: ["鍼灸師（国家資格）", "柔道整復師"],
                  bio: "産後ケア・骨盤矯正を専門とし、女性特有のお悩みに寄り添った施術を提供。「痛くない優しい整体」が得意です。",
                },
              ].map((staff) => (
                <div key={staff.name} className="bg-white border border-[#DDD9D2] p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#2B3A52] flex items-center justify-center shrink-0">
                      <span className="font-serif text-2xl font-bold text-white">{staff.initial}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2B3A52] text-lg leading-none">{staff.name}</h3>
                      <p className="text-xs text-[#5C7FA3] mt-1 mb-3">{staff.role}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {staff.certs.map((c) => (
                          <span key={c} className="inline-flex items-center gap-1 text-[10px] bg-[#F7F4EE] border border-[#DDD9D2] text-[#2B3A52] px-2 py-1">
                            <Check size={9} className="text-[#5C7FA3]" />
                            {c}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-[#7A7570] leading-relaxed">{staff.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── お客様の声 ─── */}
        <section className="bg-[#F7F4EE] py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#5C7FA3] text-xs tracking-[0.2em] uppercase mb-3">Reviews</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2B3A52]">お客様の声</h2>
              <div className="w-10 h-0.5 bg-[#5C7FA3] mx-auto mt-4" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {[
                { name: "山田さん（40代・男性）", symptom: "腰痛・ぎっくり腰", text: "長年の腰痛が3回の施術でかなり楽になりました。原因をしっかり説明してもらえ、自宅でのケアも教えてもらえたのが良かったです。" },
                { name: "鈴木さん（30代・女性）", symptom: "肩こり・頭痛", text: "デスクワークで毎日頭痛がひどかったのですが、施術後は別人のように体が軽くなりました。先生の説明が丁寧でとても安心できました。" },
                { name: "田中さん（20代・女性）", symptom: "産後骨盤矯正", text: "産後の体のゆがみが気になっていましたが、骨盤矯正コースを受けてから腰の痛みが減り、体型も整ってきた気がします。" },
              ].map((r) => (
                <div key={r.name} className="min-w-[280px] md:min-w-0 bg-white border border-[#DDD9D2] p-6 flex flex-col">
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => <span key={s} className="text-amber-400 text-sm">★</span>)}
                  </div>
                  <span className="text-[10px] text-white bg-[#5C7FA3] px-2 py-0.5 self-start mb-3">{r.symptom}</span>
                  <p className="text-sm text-[#7A7570] leading-relaxed flex-1 mb-4">「{r.text}」</p>
                  <p className="text-xs font-medium text-[#2B3A52]">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 予約CTA ─── */}
        <section className="bg-[#2B3A52] py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#93BDD4] text-xs tracking-[0.2em] uppercase mb-4">Reservation</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">まずはお気軽にどうぞ</h2>
            <p className="text-white/70 text-sm mb-8">初めての方も安心。丁寧にご説明します。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reserve"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#2B3A52] font-bold px-10 py-4 text-sm hover:bg-[#F7F4EE] transition-colors"
              >
                ネット予約（24時間受付）
                <ChevronRight size={16} />
              </Link>
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-medium px-10 py-4 text-sm hover:bg-white/10 transition-colors"
                >
                  <Phone size={15} />
                  {settings.phone}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ─── フッター ─── */}
        <footer className="bg-[#1B2940] py-10">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-serif text-xl font-bold text-white mb-3">小川整体院</p>
            {settings?.address && (
              <p className="text-sm text-white/60 flex items-center justify-center gap-1.5 mb-1">
                <MapPin size={12} />{settings.address}
              </p>
            )}
            {settings?.phone && (
              <p className="text-sm text-white/60 flex items-center justify-center gap-1.5 mb-1">
                <Phone size={12} />{settings.phone}
              </p>
            )}
            {settings && (
              <p className="text-sm text-white/60 flex items-center justify-center gap-1.5 mb-6">
                <Clock size={12} />{settings.openTime} 〜 {settings.closeTime}（日曜定休）
              </p>
            )}
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} 小川整体院. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* ─── モバイル固定CTA ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#2B3A52] border-t border-[#1B2940] px-4 pt-3 z-20 md:hidden"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <Link
          href="/reserve"
          className="flex items-center justify-center gap-2 bg-white text-[#2B3A52] font-bold py-4 text-sm w-full active:scale-[0.97] transition-all"
        >
          ネット予約（24時間受付）
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
