"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isFirstVisit: boolean;
  createdAt: string;
  _count: { reservations: number };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?q=${encodeURIComponent(q)}`);
      setCustomers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchCustomers]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2c2c2c]">顧客管理</h1>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b8afa6]" />
        <Input
          className="pl-10"
          placeholder="名前・メール・電話番号で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-[#8a7e72]">読み込み中...</div>
        ) : customers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10 text-[#8a7e72]">
              顧客が見つかりません
            </CardContent>
          </Card>
        ) : (
          customers.map((c) => (
            <Link key={c.id} href={`/admin/customers/${c.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#2c2c2c]">{c.name}</p>
                        {c.isFirstVisit && (
                          <Badge variant="secondary">未来院</Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#8a7e72]">{c.email}</p>
                      {c.phone && <p className="text-sm text-[#8a7e72]">{c.phone}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#2d6a4f]">
                        {c._count.reservations}回来院
                      </p>
                      <p className="text-xs text-[#b8afa6]">
                        登録: {format(new Date(c.createdAt), "yyyy/M/d")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
