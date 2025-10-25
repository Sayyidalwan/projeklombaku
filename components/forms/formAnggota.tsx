"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react"; 

interface FormState {
  nama: string;
  umur: string;
  hubungan: string;
  nomor_wa: string;
}

interface ErrorsState {
  nama: string;
  umur: string;
  nomor_wa: string;
}

const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-500 text-sm mt-1">{message}</p>
);

const RequiredLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <Label htmlFor={htmlFor}>
        {children}
        <span className="text-red-500 ml-1">*</span> 
    </Label>
);

export default function FormAnggota() {
  const [form, setForm] = useState<FormState>({
    nama: "",
    umur: "",
    hubungan: "",
    nomor_wa: "",
  });

  const [errors, setErrors] = useState<ErrorsState>({
    nama: "",
    umur: "",
    nomor_wa: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ ...errors, [e.target.id]: "" });
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const validateForm = (formData: FormState) => {
    let isValid = true;
    let newErrors: ErrorsState = { nama: "", umur: "", nomor_wa: "" };

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama anggota wajib diisi.";
      isValid = false;
    }
    
    if (formData.umur && (isNaN(Number(formData.umur)) || Number(formData.umur) < 1)) {
        newErrors.umur = "Umur harus berupa angka positif.";
        isValid = false;
    }
    
    const trimmedNomorWa = formData.nomor_wa.trim();
    if (!trimmedNomorWa) {
        newErrors.nomor_wa = "Nomor WhatsApp wajib diisi.";
        isValid = false;
    } else {
        const waPattern = /^(62|08)\d{8,13}$/; 
        if (!waPattern.test(trimmedNomorWa)) {
            newErrors.nomor_wa = "Nomor WhatsApp tidak valid";
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm(form)) {
        alert("Mohon lengkapi atau perbaiki data yang ditandai merah.");
        return; 
    }
    
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
        setErrors({ nama: "", umur: "", nomor_wa: "" });

    } else { 
        const serverError = data.error || "Gagal menyimpan data. Terjadi kesalahan pada server atau jaringan.";
        alert(`Gagal: ${serverError}`);
    }
  };

  const getErrorClass = (field: keyof ErrorsState) => 
    errors[field] ? "border-red-500 focus-visible:ring-red-500" : "";


  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Data Anggota</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RequiredLabel htmlFor="nama">Nama</RequiredLabel> 
          <Input 
            id="nama" 
            value={form.nama} 
            onChange={handleChange} 
            placeholder="Masukkan nama anggota" 
            className={getErrorClass('nama')} 
          />
          {errors.nama && <ErrorMessage message={errors.nama} />}
        </div>
        <div>
          <Label htmlFor="umur">Umur</Label>
          <Input 
            id="umur" 
            type="number" 
            value={form.umur} 
            onChange={handleChange} 
            placeholder="Masukkan umur" 
            min="1" 
            className={getErrorClass('umur')} 
          />
          {errors.umur && <ErrorMessage message={errors.umur} />}
        </div>
        <div>
          <Label htmlFor="hubungan">Hubungan</Label>
          <Input 
            id="hubungan" 
            value={form.hubungan} 
            onChange={handleChange} 
            placeholder="Contoh: Anak, Ayah, Ibu" 
          />
        </div>
        <div>
          <RequiredLabel htmlFor="nomor_wa">Nomor WhatsApp</RequiredLabel>
          <Input 
            id="nomor_wa" 
            value={form.nomor_wa} 
            onChange={handleChange} 
            type="tel" 
            placeholder="6281234567890" 
            className={getErrorClass('nomor_wa')} 
          />
          {errors.nomor_wa && <ErrorMessage message={errors.nomor_wa} />}
        </div>
        <Button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white">
          Simpan
        </Button>
      </form>
    </section>
  );
}