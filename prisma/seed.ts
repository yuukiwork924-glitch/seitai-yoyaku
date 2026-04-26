import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 管理者ユーザー
  const adminHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "院長 田中",
      phone: "03-1234-5678",
      passwordHash: adminHash,
      role: "ADMIN",
      isFirstVisit: false,
    },
  });
  console.log("✓ Admin user:", admin.email);

  // デモ顧客
  const customerHash = await bcrypt.hash("password123", 10);
  const customer1 = await prisma.user.upsert({
    where: { email: "customer1@example.com" },
    update: {},
    create: {
      email: "customer1@example.com",
      name: "山田 花子",
      phone: "090-1111-2222",
      passwordHash: customerHash,
      role: "CUSTOMER",
      isFirstVisit: false,
    },
  });
  const customer2 = await prisma.user.upsert({
    where: { email: "customer2@example.com" },
    update: {},
    create: {
      email: "customer2@example.com",
      name: "鈴木 太郎",
      phone: "090-3333-4444",
      passwordHash: customerHash,
      role: "CUSTOMER",
      isFirstVisit: true,
    },
  });
  console.log("✓ Customers:", customer1.name, customer2.name);

  // スタッフ
  const staff1 = await prisma.staff.upsert({
    where: { email: "tanaka@example.com" },
    update: {},
    create: {
      name: "田中 健二",
      email: "tanaka@example.com",
      bio: "整体歴15年。腰痛・肩こりが得意分野です。",
      isActive: true,
    },
  });
  const staff2 = await prisma.staff.upsert({
    where: { email: "sato@example.com" },
    update: {},
    create: {
      name: "佐藤 美咲",
      email: "sato@example.com",
      bio: "産後ケア・骨盤矯正専門。丁寧な施術が好評です。",
      isActive: true,
    },
  });
  console.log("✓ Staff:", staff1.name, staff2.name);

  // 今週のシフト（月〜土）
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // 日曜休み

    for (const staff of [staff1, staff2]) {
      await prisma.staffSchedule.upsert({
        where: { staffId_date: { staffId: staff.id, date: dateStr } },
        update: {},
        create: {
          staffId: staff.id,
          date: dateStr,
          startTime: "09:00",
          endTime: "18:00",
          isOff: false,
        },
      });
    }
  }
  console.log("✓ Staff schedules created");

  // 施術メニュー
  const menus = [
    {
      name: "全身整体（60分）",
      description: "全身の歪みを整えます。初めての方におすすめ。",
      duration: 60,
      price: 7700,
      category: "全身",
      sortOrder: 1,
    },
    {
      name: "腰痛集中ケア（45分）",
      description: "腰周りを重点的にほぐします。",
      duration: 45,
      price: 5500,
      category: "部分",
      sortOrder: 2,
    },
    {
      name: "肩こり・首コリ解消（30分）",
      description: "デスクワークの疲れに。",
      duration: 30,
      price: 3300,
      category: "部分",
      sortOrder: 3,
    },
    {
      name: "骨盤矯正（60分）",
      description: "産後ケアにも対応。",
      duration: 60,
      price: 8800,
      category: "矯正",
      sortOrder: 4,
    },
    {
      name: "リラクゼーションコース（90分）",
      description: "全身ゆっくりほぐすプレミアムコース。",
      duration: 90,
      price: 11000,
      category: "全身",
      sortOrder: 5,
    },
  ];

  const createdMenus: Array<{ id: string }> = [];
  for (const m of menus) {
    const menu = await prisma.menu.upsert({
      where: { id: `menu-seed-${m.sortOrder}` },
      update: {},
      create: { id: `menu-seed-${m.sortOrder}`, ...m },
    });
    createdMenus.push(menu);
  }
  console.log("✓ Menus:", menus.length, "items");

  // 営業設定
  const existing = await prisma.businessSettings.findFirst();
  let settings;
  if (!existing) {
    settings = await prisma.businessSettings.create({
      data: {
        clinicName: "小川クリニック",
        openTime: "09:00",
        closeTime: "19:00",
        slotIntervalMin: 60,
        maxConcurrent: 2,
        cancelDeadlineHrs: 24,
        pointPerVisit: 1,
        pointToYen: 100,
        address: "東京都渋谷区〇〇1-2-3",
        phone: "03-1234-5678",
        description: "体の不調を根本から改善。丁寧なカウンセリングと施術で、あなたの健康をサポートします。",
      },
    });
  } else {
    settings = existing;
  }
  console.log("✓ BusinessSettings:", settings.clinicName);

  // 休診日（今月の日曜日）
  const year = today.getFullYear();
  const month = today.getMonth();
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === 0) {
      const dateStr = d.toISOString().split("T")[0];
      const existingClosed = await prisma.closedDay.findUnique({
        where: { settingsId_date: { settingsId: settings.id, date: dateStr } },
      });
      if (!existingClosed) {
        await prisma.closedDay.create({
          data: { settingsId: settings.id, date: dateStr, reason: "定休日（日曜）" },
        });
      }
    }
  }
  console.log("✓ Closed days set");

  // 問診票（customer1 は再診なので作成済み想定）
  await prisma.intakeForm.upsert({
    where: { userId: customer1.id },
    update: {},
    create: {
      userId: customer1.id,
      birthDate: "1990-05-15",
      gender: "female",
      occupation: "会社員",
      chiefComplaint: "肩こり・腰痛",
      medicalHistory: "特になし",
      medications: "なし",
      allergies: "なし",
    },
  });
  console.log("✓ Intake form for", customer1.name);

  // 過去の予約（customer1）
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);
  pastDate.setHours(10, 0, 0, 0);

  const pastReservation = await prisma.reservation.create({
    data: {
      userId: customer1.id,
      staffId: staff1.id,
      menuId: createdMenus[0].id,
      startTime: pastDate,
      endTime: new Date(pastDate.getTime() + 60 * 60 * 1000),
      status: "COMPLETED",
      isFirstVisit: false,
      pointsUsed: 0,
    },
  });

  // カルテ作成
  await prisma.medicalRecord.upsert({
    where: { reservationId: pastReservation.id },
    update: {},
    create: {
      userId: customer1.id,
      reservationId: pastReservation.id,
      symptoms: "慢性的な肩こり、デスクワークによる疲労",
      treatment: "頸部・肩甲骨周辺のリリース、胸椎モビリゼーション",
      staffNote: "右肩に強い緊張あり。次回も同部位を中心にケアする。",
      nextPlan: "2週間に1回のペースで継続施術を提案",
    },
  });

  // ポイント付与
  await prisma.pointTransaction.upsert({
    where: { reservationId: pastReservation.id },
    update: {},
    create: {
      userId: customer1.id,
      reservationId: pastReservation.id,
      delta: 1,
      balance: 1,
      description: "施術来院ポイント",
    },
  });
  console.log("✓ Past reservation + medical record + points for", customer1.name);

  // 明日の予約（確定済み）
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(11, 0, 0, 0);

  await prisma.reservation.create({
    data: {
      userId: customer1.id,
      staffId: staff2.id,
      menuId: createdMenus[1].id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 45 * 60 * 1000),
      status: "CONFIRMED",
      isFirstVisit: false,
      pointsUsed: 0,
    },
  });
  console.log("✓ Tomorrow reservation for", customer1.name);

  console.log("\n🎉 Seeding complete!");
  console.log("─────────────────────────────────");
  console.log("管理者ログイン:  admin@example.com / password123");
  console.log("顧客ログイン:    customer1@example.com / password123");
  console.log("顧客(初回):      customer2@example.com / password123");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
