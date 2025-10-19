"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JadwalObat {
  jadwal_id: number;
  anggota_nama: string;
  nama_obat: string;
  jam_minum: string;
  status: "SUDAH" | "BELUM";
}

export default function StatusMinumObat() {
  const [jadwal, setJadwal] = useState<JadwalObat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/jadwal-obat");
        if (!res.ok) throw new Error("Fetch gagal");
        const data = await res.json();
        setJadwal(data);
      } catch (err) {
        console.error("Gagal memuat jadwal obat:", err);
        setJadwal([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleStatus = async (jadwal_id: number) => {
    const item = jadwal.find((j) => j.jadwal_id === jadwal_id);
    if (!item) return;

    const newStatus = item.status === "SUDAH" ? "BELUM" : "SUDAH";

    // optimistik update UI
    setJadwal((prev) =>
      prev.map((j) =>
        j.jadwal_id === jadwal_id ? { ...j, status: newStatus } : j
      )
    );

    try {
      await fetch(`/api/jadwal-obat/${jadwal_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Gagal update status:", err);
      // rollback sederhana kalau gagal
      setJadwal((prev) =>
        prev.map((j) =>
          j.jadwal_id === jadwal_id ? { ...j, status: item.status } : j
        )
      );
    }
  };

  if (loading) return <p className="text-center text-gray-500">Memuat data...</p>;
  if (jadwal.length === 0)
    return <p className="text-center text-gray-500">Belum ada jadwal obat yang tercatat.</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Status Minum Obat Keluarga</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {jadwal.map((item) => (
          <Card key={item.jadwal_id} className="shadow-sm border border-gray-200">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{item.anggota_nama}</CardTitle>
              <Badge variant={item.status === "SUDAH" ? "secondary" : "destructive"}>
                {item.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Obat:</strong> {item.nama_obat}</p>
              <p><strong>Jam Minum:</strong> {item.jam_minum}</p>
              <Button
                variant={item.status === "SUDAH" ? "outline" : "default"}
                onClick={() => toggleStatus(item.jadwal_id)}
              >
                {item.status === "SUDAH" ? "Batalkan" : "Tandai Sudah Minum"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
