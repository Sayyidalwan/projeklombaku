"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Errors {
  username?: string;
  noWa?: string;
  general?: string;
}

const cn = ( ...classes: (string | boolean | undefined)[] ) => {
  return classes.filter(Boolean).join(' ');
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
  username: "",
  noWa: "",
  });
  const [errors, setErrors] = useState<Errors>({}); 
  const [isLoading, setIsLoading] = useState(false);

  const validateClient = (data: typeof formData): Errors => {
    const newErrors: Errors = {};
    const usernameRegex = /^[a-z0-9]+$/;
    if (data.username.trim() === "") {
      newErrors.username = "Username wajib diisi.";
    } else if (!usernameRegex.test(data.username)) {
      newErrors.username = "Username harus huruf kecil, tanpa spasi, dan hanya boleh mengandung angka.";
    }
    const noWaRegex = /^(62|08)\d+$/;
    if (data.noWa.trim() === "") {
      newErrors.noWa = "Nomor WhatsApp wajib diisi.";
    } else if (!noWaRegex.test(data.noWa)) {
      newErrors.noWa = "Nomor WhatsApp harus diawali '62' atau '08'.";
    }
    return newErrors;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  let newValue = value;
  setErrors(prev => ({ ...prev, [id as keyof Errors]: undefined, general: undefined }));
  if (id === 'username') {
    newValue = value.toLowerCase().replace(/\s/g, ''); 
  }
  setFormData({ ...formData, [id]: newValue });
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const fieldErrors = validateClient(formData);
    const error = fieldErrors[id as keyof Errors];
    if (error) {
      setErrors(prev => ({ ...prev, [id as keyof Errors]: error }));
    } else {
      setErrors(prev => ({ ...prev, [id as keyof Errors]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  const clientErrors = validateClient(formData);
  if (Object.keys(clientErrors).length > 0) {
    setErrors(clientErrors);
    return; 
  }
  setIsLoading(true);
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok && data.success) { 
      alert(`Selamat datang, ${data.user.nama}!`);
      window.location.href = "/dashboard"; 
    } else if (res.status === 400 || res.status === 404) {
      setErrors(prev => ({ ...prev, general: data.message || "Gagal login." }));
    } else {
      setErrors(prev => ({ ...prev, general: "Terjadi kesalahan server. Silakan coba lagi." }));
    }
  } catch (err) {
    setErrors(prev => ({ ...prev, general: "Terjadi kesalahan jaringan." }));
  } finally {
    setIsLoading(false);
  }
  };
  
  const isUsernameInvalid = errors.username !== undefined;
  const isNomorWaInvalid = errors.noWa !== undefined;

  return (
  <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <Card className="w-full max-w-md shadow-lg border rounded-2xl bg-white">
    <CardHeader>
      <CardTitle className="text-center text-2xl font-bold text-gray-800">
      Login
      </CardTitle>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <p className="text-sm text-red-500 text-center font-medium">
        {errors.general}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
        id="username"
        type="text"
        placeholder="Masukkan username"
        value={formData.username}
        onChange={handleChange}
        onBlur={handleBlur} 
        required
        className={cn(
          isUsernameInvalid ? "border-red-500 focus:border-red-500 ring-red-500" : ""
        )}
        />
        {errors.username && (
        <p className="text-sm text-red-500 mt-1">
          {errors.username}
        </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="noWa">Nomor WhatsApp</Label>
        <Input
        id="noWa"
        type="tel"
        placeholder="Contoh: 6281234567890"
        value={formData.noWa}
        onChange={handleChange}
        onBlur={handleBlur} 
        required
        className={cn(
          isNomorWaInvalid ? "border-red-500 focus:border-red-500 ring-red-500" : ""
        )}
        />
        {errors.noWa && (
        <p className="text-sm text-red-500 mt-1">
          {errors.noWa}
        </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Memproses..." : "Login"}
      </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
      Belum punya akun?{" "}
      <a href="/register" className="text-blue-600 hover:underline">
        Daftar di sini
      </a>
      </p>
    </CardContent>
    </Card>
  </main>
  );
}
