"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "予約確定",
  COMPLETED: "施術完了",
  CANCELLED: "キャンセル",
  NO_SHOW: "無断キャンセル",
};

const STATUS_VARIANT: Record<string, "confirmed" | "completed" | "cancelled" | "no_show"> = {
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [medicalRecord, setMedicalRecord] = useState({
    symptoms: "",
    treatment: "",
    staffNote: "",
    nextPlan: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/reservations/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setReservation(data);
        if (data.medicalRecord) {
          setMedicalRecord({
            symptoms: data.medicalRecord.symptoms ?? "",
            treatment: data.medicalRecord.treatment ?? "",
            staffNote: data.medicalRecord.staffNote ?? "",
            nextPlan: data.medicalRecord.nextPlan ?? "",
          });
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleStatusChange = async (status: string) => {
    const res = await fetch(`/api/reservations/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReservation((prev) => prev ? { ...prev, status: updated.status } : null);
      setMessage("ステータスを更新しました");
    }
  };

  const handleSaveMedical = async () => {
    if (!reservation) return;
    setSaving(true);
    const res = await fetch(`/api/medical-records/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reservationId: params.id,
        userId: (reservation.user as { id: string }).id,
        ...medicalRecord,
      }),
    });
    setSaving(false);
    if (res.ok) setMessage("カルテを保存しました");
  };

  const handleCancel = async () => {
    if (!confirm("この予約をキャンセルしますか？")) return;
    const res = await fetch(`/api/reservations/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) router.push("/admin/reservations");
  };

  if (loading) return <div className="text-center py-20 text-[#8a7e72]">読み込み中...</div>;
  if (!reservation) return <div className="text-center py-20 text-[#8a7e72]">予約が見つかりません</div>;

  const user = reservation.user as { id: string; name: string; email: string; phone?: string };
  const menu = reservation.menu as { name: string; price: number; duration: number };
  const staff = reservation.staff as { name: string } | null;
  const status = reservation.status as string;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/reservations">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#2c2c2c]">予約詳細</h1>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      {/* 予約情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>予約情報</CardTitle>
            <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
              {STATUS_LABEL[status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#8a7e72]">顧客名</p>
              <Link href={`/admin/customers/${user.id}`} className="font-medium text-[#2d6a4f] hover:underline">
                {user.name}
              </Link>
            </div>
            <div>
              <p className="text-[#8a7e72]">連絡先</p>
              <p className="font-medium">{user.phone ?? user.email}</p>
            </div>
            <div>
              <p className="text-[#8a7e72]">メニュー</p>
              <p className="font-medium">{menu.name}</p>
            </div>
            <div>
              <p className="text-[#8a7e72]">担当スタッフ</p>
              <p className="font-medium">{staff?.name ?? "指名なし"}</p>
            </div>
            <div>
              <p className="text-[#8a7e72]">日時</p>
              <p className="font-medium">
                {format(new Date(reservation.startTime as string), "M月d日（E）HH:mm〜", { locale: ja })}
                {format(new Date(reservation.endTime as string), "HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-[#8a7e72]">初回 / 再診</p>
              <p className="font-medium">{reservation.isFirstVisit ? "初回" : "再診"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {status === "CONFIRMED" && (
              <>
                <Button size="sm" onClick={() => handleStatusChange("COMPLETED")}>
                  施術完了にする
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleStatusChange("NO_SHOW")}>
                  無断キャンセル
                </Button>
                <Button size="sm" variant="destructive" onClick={handleCancel}>
                  キャンセル
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* カルテ記入 */}
      <Card>
        <CardHeader>
          <CardTitle>カルテ記入</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>主訴・来院目的</Label>
            <Textarea
              className="mt-1"
              placeholder="肩こり、腰痛など"
              value={medicalRecord.symptoms}
              onChange={(e) => setMedicalRecord((p) => ({ ...p, symptoms: e.target.value }))}
            />
          </div>
          <div>
            <Label>施術内容</Label>
            <Textarea
              className="mt-1"
              placeholder="どの部位にどんな施術をしたか"
              value={medicalRecord.treatment}
              onChange={(e) => setMedicalRecord((p) => ({ ...p, treatment: e.target.value }))}
            />
          </div>
          <div>
            <Label>施術者所見</Label>
            <Textarea
              className="mt-1"
              placeholder="気になる点、所見など"
              value={medicalRecord.staffNote}
              onChange={(e) => setMedicalRecord((p) => ({ ...p, staffNote: e.target.value }))}
            />
          </div>
          <div>
            <Label>次回方針</Label>
            <Textarea
              className="mt-1"
              placeholder="次回施術の方針"
              value={medicalRecord.nextPlan}
              onChange={(e) => setMedicalRecord((p) => ({ ...p, nextPlan: e.target.value }))}
            />
          </div>
          <Button onClick={handleSaveMedical} disabled={saving} className="w-full">
            {saving ? "保存中..." : "カルテを保存"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
