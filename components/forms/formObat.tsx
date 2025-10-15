"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function FormObat() {
  const [obat, setObat] = useState({
    nama_obat: "",
    dosis: "",
    keterangan: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    jam_minum: "",
    status: "BELUM",
    tanggal: "",
  });

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Data Obat & Jadwal Minum</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nama_obat">Nama Obat</Label>
          <Input id="nama_obat" placeholder="Contoh: Paracetamol" />
        </div>

        <div>
          <Label htmlFor="dosis">Dosis</Label>
          <Input id="dosis" placeholder="Contoh: 3x sehari" />
        </div>

        <div>
          <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
          <Input id="tanggal_mulai" type="date" />
        </div>

        <div>
          <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
          <Input id="tanggal_selesai" type="date" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea id="keterangan" placeholder="Masukkan keterangan tambahan" />
        </div>

        <div>
          <Label htmlFor="jam_minum">Jam Minum</Label>
          <Input id="jam_minum" type="time" />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="border rounded-md w-full p-2"
            defaultValue="BELUM"
          >
            <option value="BELUM">BELUM</option>
            <option value="SUDAH">SUDAH</option>
          </select>
        </div>

        <div>
          <Label htmlFor="tanggal">Tanggal</Label>
          <Input id="tanggal" type="date" />
        </div>
      </div>
    </section>
  );
}
