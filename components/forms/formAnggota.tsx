"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function FormAnggota() {
  const [form, setForm] = useState({
    nama: "",
    umur: "",
    hubungan: "",
    nomor_wa: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const res = await fetch("/api/anggota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    const data = await res.json();
    
    if (res.ok) { 
        alert(data.message || "Data anggota berhasil disimpan.");
        
        setForm({
            nama: "",
            umur: "",
            hubungan: "",
            nomor_wa: "",
        });

    } else { 
        alert(data.error || "Gagal menyimpan data. Terjadi kesalahan pada server atau jaringan.");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Data Anggota</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input id="nama" value={form.nama} onChange={handleChange} placeholder="Masukkan nama anggota" required />
        </div>
        <div>
          <Label htmlFor="umur">Umur</Label>
          <Input id="umur" type="number" value={form.umur} onChange={handleChange} placeholder="Masukkan umur" />
        </div>
        <div>
          <Label htmlFor="hubungan">Hubungan</Label>
          <Input id="hubungan" value={form.hubungan} onChange={handleChange} placeholder="Contoh: Anak, Ayah, Ibu" />
        </div>
        <div>
          <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
          <Input id="nomor_wa" value={form.nomor_wa} onChange={handleChange} type="tel" placeholder="6281234567890" />
        </div>
        <Button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white">
          Simpan
        </Button>
      </form>
    </section>
  );
}
