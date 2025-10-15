"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormAnggota() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Data Anggota</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input id="nama" placeholder="Masukkan nama anggota" required />
        </div>
        <div>
          <Label htmlFor="umur">Umur</Label>
          <Input id="umur" type="number" placeholder="Masukkan umur" />
        </div>
        <div>
          <Label htmlFor="hubungan">Hubungan</Label>
          <Input id="hubungan" placeholder="Contoh: Anak, Ayah, Ibu" />
        </div>
        <div>
          <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
          <Input id="nomor_wa" type="tel" placeholder="6281234567890" />
        </div>
      </div>
    </section>
  );
}
