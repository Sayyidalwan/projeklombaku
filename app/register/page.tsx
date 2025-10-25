"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Errors {
  [key: string]: string | undefined;
}

interface FormData {
  nama: string;
  nomor_wa: string;
}

export default function FormRegistrasi() {
  const router = useRouter(); 

  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nomor_wa: "",
  });
  const [errors, setErrors] = useState<Errors>({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateClient = (id: 'nama' | 'nomor_wa', value: string): string | null => {
    if (value.trim() === "") {
      return `${id === 'nama' ? 'Nama' : 'Nomor WhatsApp'} wajib diisi.`;
    }

    if (id === 'nama') {
      const clean_value = value.trim();
      if (/\s/.test(clean_value)) {
        return "Nama tidak boleh mengandung spasi.";
      }
      if (clean_value !== clean_value.toLowerCase()) {
        return "Nama harus menggunakan huruf kecil semua.";
      }
    }

    if (id === 'nomor_wa') {
      const clean_value = value.replace(/\D/g, '');
      const validPrefix = clean_value.startsWith('62') || clean_value.startsWith('08');
      if (!validPrefix) {
        return "Nomor WhatsApp harus diawali dengan '62' atau '08'.";
      }
      if (clean_value.length < 10 || clean_value.length > 15) {
        return "Format Nomor WhatsApp tidak valid (panjang minimal 10, maksimal 15 digit).";
      }
    }

    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let newValue = value;

    setErrors(prev => ({ ...prev, [id]: undefined }));

    if (id === 'nama') {
      newValue = value.toLowerCase(); 
    }
    
    setFormData(prev => ({ ...prev, [id]: newValue }));
    
    const error = validateClient(id as 'nama' | 'nomor_wa', newValue);
    if (error) {
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const error = validateClient(id as 'nama' | 'nomor_wa', value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [id]: error }));
    } else {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.id === 'nama' && e.key === ' ') {
      e.preventDefault();
      setErrors(prev => ({ ...prev, 'nama': 'Nama tidak boleh mengandung spasi.' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const initialErrors: Errors = {};
    let hasClientError = false;

    const namaError = validateClient('nama', formData.nama);
    if (namaError) { initialErrors.nama = namaError; hasClientError = true; }

    const nomorWaError = validateClient('nomor_wa', formData.nomor_wa);
    if (nomorWaError) { initialErrors.nomor_wa = nomorWaError; hasClientError = true; }

    if (hasClientError) {
      setErrors(initialErrors);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); 

      if (res.ok && data.success) { 
        alert("Registrasi berhasil! Anda akan diarahkan ke halaman Login.");
        setFormData({ nama: "", nomor_wa: "" });
        router.push('/login'); 

      } else if (data.errors && Array.isArray(data.errors)) {
        const serverErrors: Errors = {};
        data.errors.forEach((err: string) => {
          if (err.toLowerCase().includes("nama")) {
            serverErrors.nama = err;
          } else if (err.toLowerCase().includes("nomor whatsapp") || err.toLowerCase().includes("terdaftar")) {
            serverErrors.nomor_wa = err;
          }
        });
        setErrors(serverErrors);
      } else {
        alert(data.message || "Gagal registrasi.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isNamaInvalid = errors.nama !== undefined;
  const isNomorWaInvalid = errors.nomor_wa !== undefined;

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-800">
        Registrasi
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama</Label>
          <Input
          id="nama"
          type="text"
          placeholder="Masukkan nama"
          value={formData.nama}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown} 
          required
          className={isNamaInvalid ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.nama && (
          <p className="text-sm text-red-500">{errors.nama}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
          <Input
          id="nomor_wa"
          type="tel"
          placeholder="Contoh: 081234567890" 
          value={formData.nomor_wa}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={isNomorWaInvalid ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.nomor_wa && (
          <p className="text-sm text-red-500">{errors.nomor_wa}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
        </Button>
        </form>
      </CardContent>
      </Card>
    </main>
  );
}
