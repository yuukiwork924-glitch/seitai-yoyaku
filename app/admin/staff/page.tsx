"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import type { Staff } from "@/types";

type StaffForm = { name: string; email: string; bio: string };
const emptyForm: StaffForm = { name: "", email: "", bio: "" };

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    const res = await fetch("/api/staff");
    setStaffList(await res.json());
  };

  useEffect(() => { fetchStaff(); }, []);

  const openEdit = (s: Staff) => {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email, bio: s.bio ?? "" });
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = editId
      ? await fetch(`/api/staff/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
    setLoading(false);
    if (res.ok) { setOpen(false); fetchStaff(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2c2c2c]">スタッフ管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus size={16} className="mr-1" />スタッフ追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "スタッフ編集" : "スタッフ追加"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>名前 *</Label>
                <Input className="mt-1" value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <Label>メール *</Label>
                <Input type="email" className="mt-1" value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <Label>自己紹介</Label>
                <Textarea className="mt-1" value={form.bio}
                  onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "保存中..." : editId ? "更新する" : "追加する"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {staffList.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#2c2c2c]">{s.name}</p>
                  <p className="text-sm text-[#8a7e72]">{s.email}</p>
                  {s.bio && <p className="text-sm text-[#5a4e45] mt-0.5 line-clamp-1">{s.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/staff/${s.id}`}>
                    <Button variant="outline" size="sm">
                      <Calendar size={14} className="mr-1" />シフト
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                    <Pencil size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
