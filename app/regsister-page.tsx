"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FormRegistrasi() {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    nama: "",
    nomor_wa: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json(); 

        if (res.ok && data.success) { 
          console.log("Data masuk ke database:", data);
          alert("Registrasi berhasil! Anda akan diarahkan ke halaman Login.");
          setFormData({ nama: "", nomor_wa: "" });

          router.push('/login'); 

        } else {
            const errorMessage = data.errors?.join(' ') || data.message || "Gagal registrasi.";
            alert(errorMessage);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Form Registrasi
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
              <Input
                id="nomor_wa"
                type="tel"
                placeholder="Contoh: 6281234567890"
                value={formData.nomor_wa}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Daftar Sekarang
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}