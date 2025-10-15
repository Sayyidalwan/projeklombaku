"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FormKontrol() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Jadwal Kontrol</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal_kontrol">Tanggal Kontrol</Label>
          <Input id="tanggal_kontrol" type="date" />
        </div>

        <div>
          <Label htmlFor="jam">Jam Kontrol</Label>
          <Input id="jam" type="time" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="tempat">Tempat</Label>
          <Input id="tempat" placeholder="Contoh: RSUD Kota Surabaya" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea id="keterangan" placeholder="Catatan tambahan jika ada" />
        </div>
      </div>
    </section>
  );
}
