"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import type { Menu } from "@/types";

type MenuForm = {
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  sortOrder: string;
};

const emptyForm: MenuForm = {
  name: "",
  description: "",
  duration: "60",
  price: "7700",
  category: "",
  sortOrder: "0",
};

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMenus = async () => {
    const res = await fetch("/api/menus");
    setMenus(await res.json());
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const openEdit = (menu: Menu) => {
    setEditId(menu.id);
    setForm({
      name: menu.name,
      description: menu.description ?? "",
      duration: String(menu.duration),
      price: String(menu.price),
      category: menu.category ?? "",
      sortOrder: String(menu.sortOrder),
    });
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

    const payload = {
      name: form.name,
      description: form.description || null,
      duration: Number(form.duration),
      price: Number(form.price),
      category: form.category || null,
      sortOrder: Number(form.sortOrder),
    };

    const res = editId
      ? await fetch(`/api/menus/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setLoading(false);
    if (res.ok) {
      setOpen(false);
      fetchMenus();
    }
  };

  const toggleActive = async (menu: Menu) => {
    await fetch(`/api/menus/${menu.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !menu.isActive }),
    });
    fetchMenus();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2c2c2c]">メニュー管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus size={16} className="mr-1" />
              メニュー追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "メニュー編集" : "メニュー追加"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>メニュー名 *</Label>
                <Input
                  className="mt-1"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>説明</Label>
                <Textarea
                  className="mt-1"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>施術時間（分） *</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>料金（円） *</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>カテゴリ</Label>
                  <Input
                    className="mt-1"
                    placeholder="全身、部分、矯正..."
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>表示順</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.sortOrder}
                    onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "保存中..." : editId ? "更新する" : "追加する"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {menus.map((menu) => (
          <Card key={menu.id} className={menu.isActive ? "" : "opacity-50"}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#2c2c2c] truncate">{menu.name}</h3>
                    {menu.category && (
                      <span className="text-xs bg-[#f0ebe4] text-[#5a4e45] px-2 py-0.5 rounded-full">
                        {menu.category}
                      </span>
                    )}
                  </div>
                  {menu.description && (
                    <p className="text-sm text-[#8a7e72] mt-0.5 line-clamp-1">{menu.description}</p>
                  )}
                  <p className="text-sm font-medium text-[#2d6a4f] mt-1">
                    {formatCurrency(menu.price)} · {menu.duration}分
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(menu)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <button
                    onClick={() => toggleActive(menu)}
                    className="text-[#8a7e72] hover:text-[#2d6a4f] transition-colors"
                    title={menu.isActive ? "無効にする" : "有効にする"}
                  >
                    {menu.isActive ? <ToggleRight size={22} className="text-[#2d6a4f]" /> : <ToggleLeft size={22} />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
