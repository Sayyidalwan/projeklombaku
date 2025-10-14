"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [form, setForm] = useState({ nama: "", nomor_wa: "", alamat: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate(values) {
    const e = {};
    if (!values.nama.trim()) e.nama = "Nama wajib diisi";
    if (!values.nomor_wa.trim()) e.nomor_wa = "Nomor WA wajib diisi";
    // Validasi sederhana untuk nomor WA Indonesia
    if (values.nomor_wa && !/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(values.nomor_wa)) {
      e.nomor_wa = "Format nomor WA tidak valid";
    }
    if (!values.alamat.trim()) e.alamat = "Alamat wajib diisi";
    if (!values.password) e.password = "Password wajib diisi";
    if (values.password && values.password.length < 6) e.password = "Password minimal 6 karakter";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      // Contoh: kirim ke API. Ganti URL sesuai backend Anda.
      // await fetch('/api/register', { method: 'POST', body: JSON.stringify(form) })

      // Untuk demo, tampilkan di console dan beri notifikasi.
      console.log("Submit data:", form);
      alert("Data berhasil dikirim (demo). Cek console untuk detail.");
      setForm({ nama: "", nomor_wa: "", alamat: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim");
    } finally {
      setSubmitting(false);
    }
  }

  function onChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Form Registrasi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" value={form.nama} onChange={(e) => onChange('nama', e.target.value)} />
            {errors.nama && <p className="text-sm text-red-600 mt-1">{errors.nama}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="nomor_wa">Nomor WA</Label>
            <Input id="nomor_wa" name="nomor_wa" value={form.nomor_wa} onChange={(e) => onChange('nomor_wa', e.target.value)} placeholder="08xxxx atau +628xxxx" />
            {errors.nomor_wa && <p className="text-sm text-red-600 mt-1">{errors.nomor_wa}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea id="alamat" name="alamat" value={form.alamat} onChange={(e) => onChange('alamat', e.target.value)} rows={3} />
            {errors.alamat && <p className="text-sm text-red-600 mt-1">{errors.alamat}</p>}
          </div>

          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>{submitting ? 'Mengirim...' : 'Daftar'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
