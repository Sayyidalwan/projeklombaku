"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JadwalObat {
  id: number;
  anggota: string;
  nama_obat: string;
  jam_minum: string;
  status: "SUDAH" | "BELUM";
}

export default function StatusMinumObat() {
  const [jadwal, setJadwal] = useState<JadwalObat[]>([]);

  useEffect(() => {
    // contoh data sementara — nanti ini diganti fetch API
    setJadwal([
      { id: 1, anggota: "Ali", nama_obat: "Paracetamol", jam_minum: "07:00", status: "BELUM" },
      { id: 2, anggota: "Siti", nama_obat: "Amoxicillin", jam_minum: "09:00", status: "SUDAH" },
    ]);
  }, []);

  const toggleStatus = (id: number) => {
    setJadwal((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "SUDAH" ? "BELUM" : "SUDAH" }
          : item
      )
    );
  };

  return (
    <div className="grid gap-4">
      {jadwal.map((item) => (
        <Card key={item.id} className="shadow-md">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{item.anggota}</CardTitle>
            <Badge variant={item.status === "SUDAH" ? "success" : "destructive"}>
              {item.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Obat:</strong> {item.nama_obat}</p>
            <p><strong>Jam Minum:</strong> {item.jam_minum}</p>
            <Button
              variant={item.status === "SUDAH" ? "outline" : "default"}
              onClick={() => toggleStatus(item.id)}
            >
              {item.status === "SUDAH" ? "Batalkan" : "Tandai Sudah Minum"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
