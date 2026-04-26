import { prisma } from "@/lib/db";
import { getPointBalance } from "@/lib/points";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "確定", COMPLETED: "完了", CANCELLED: "キャンセル", NO_SHOW: "無断"
};
const STATUS_VARIANT: Record<string, "confirmed" | "completed" | "cancelled" | "no_show"> = {
  CONFIRMED: "confirmed", COMPLETED: "completed", CANCELLED: "cancelled", NO_SHOW: "no_show"
};

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      intakeForm: true,
      reservations: {
        include: { menu: true, staff: true, medicalRecord: true },
        orderBy: { startTime: "desc" },
      },
    },
  });

  if (!user) notFound();

  const pointBalance = await getPointBalance(user.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="p-2 rounded-xl hover:bg-[#f0ebe4] transition-colors">
          <ArrowLeft size={18} className="text-[#5a4e45]" />
        </Link>
        <h1 className="text-2xl font-bold text-[#2c2c2c]">{user.name}</h1>
        {user.isFirstVisit && <Badge variant="secondary">未来院</Badge>}
      </div>

      {/* 基本情報 */}
      <Card>
        <CardHeader><CardTitle>基本情報</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-[#8a7e72]">メール</p><p className="font-medium">{user.email}</p></div>
          <div><p className="text-[#8a7e72]">電話</p><p className="font-medium">{user.phone ?? "—"}</p></div>
          <div><p className="text-[#8a7e72]">登録日</p><p className="font-medium">{format(user.createdAt, "yyyy/M/d")}</p></div>
          <div>
            <p className="text-[#8a7e72]">ポイント残高</p>
            <p className="font-bold text-[#2d6a4f] text-lg">{pointBalance}pt</p>
          </div>
        </CardContent>
      </Card>

      {/* 問診票 */}
      {user.intakeForm && (
        <Card>
          <CardHeader><CardTitle>問診票</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["生年月日", user.intakeForm.birthDate],
              ["性別", user.intakeForm.gender],
              ["職業", user.intakeForm.occupation],
              ["来院目的", user.intakeForm.chiefComplaint],
              ["既往歴", user.intakeForm.medicalHistory],
              ["服薬", user.intakeForm.medications],
              ["アレルギー", user.intakeForm.allergies],
            ].map(([label, value]) => value && (
              <div key={label}>
                <p className="text-[#8a7e72]">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 施術履歴 */}
      <Card>
        <CardHeader><CardTitle>施術履歴 ({user.reservations.length}件)</CardTitle></CardHeader>
        <CardContent>
          {user.reservations.length === 0 ? (
            <p className="text-[#8a7e72] text-sm text-center py-4">予約履歴なし</p>
          ) : (
            <div className="space-y-3">
              {user.reservations.map((r) => (
                <div key={r.id} className="border border-[#e8e1d9] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#2c2c2c]">
                        {format(r.startTime, "M月d日（E）HH:mm", { locale: ja })}
                      </p>
                      <p className="text-sm text-[#5a4e45]">
                        {r.menu.name} · {formatCurrency(r.menu.price)}
                      </p>
                      <p className="text-xs text-[#8a7e72]">
                        担当: {r.staff?.name ?? "—"} ·{" "}
                        {r.isFirstVisit ? "初回" : "再診"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={STATUS_VARIANT[r.status] ?? "secondary"}>
                        {STATUS_LABEL[r.status]}
                      </Badge>
                      <Link
                        href={`/admin/reservations/${r.id}`}
                        className="text-xs text-[#2d6a4f] hover:underline"
                      >
                        詳細・カルテ →
                      </Link>
                    </div>
                  </div>
                  {r.medicalRecord && (
                    <div className="bg-[#f5f1eb] rounded-lg p-3 text-xs space-y-1">
                      {r.medicalRecord.symptoms && (
                        <p><span className="font-medium">主訴:</span> {r.medicalRecord.symptoms}</p>
                      )}
                      {r.medicalRecord.staffNote && (
                        <p><span className="font-medium">所見:</span> {r.medicalRecord.staffNote}</p>
                      )}
                      {r.medicalRecord.nextPlan && (
                        <p><span className="font-medium">次回方針:</span> {r.medicalRecord.nextPlan}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
