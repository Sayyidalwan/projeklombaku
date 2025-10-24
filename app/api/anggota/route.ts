 // app/api/anggota/route.ts


import { PrismaClient } from "@prisma/client";

import { NextResponse } from "next/server";


// Inisialisasi Prisma Client

const prisma = new PrismaClient();


// =========================================================================

// FUNGSI GET: Mengambil daftar anggota (UNTUK MENGATASI ERROR 405 DI DASHBOARD)

// =========================================================================

export async function GET() {

try {

// Ambil semua data anggota dari database

const dataAnggota = await prisma.keluargaAnggota.findMany();

// Kembalikan data dalam format JSON dengan status 200 OK

return NextResponse.json(dataAnggota, { status: 200 });

} catch (error) {

// Log error di konsol server

console.error("Error saat mengambil data anggota:", error);

// Kembalikan respons error 500 yang valid ke frontend

return NextResponse.json({

error: "Gagal memuat data anggota dari database."

}, { status: 500 });

}

}


// =========================================================================

// FUNGSI POST: Menambah data anggota baru

// =========================================================================

export async function POST(request: Request) {

try {

const body = await request.json();


// Pastikan Anda mendapatkan user_id dengan benar (misalnya dari session/token)

// Sementara: user_id diset manual (misal 35) seperti yang Anda tentukan

const user_id = 35;


const anggotaBaru = await prisma.keluargaAnggota.create({

data: {

// user_id harus selalu ada jika ini adalah field wajib (required)

user_id: user_id,

nama: body.nama,

// Konversi umur ke integer. Jika kosong/null, set null jika field di Prisma memungkinkan (optional)

umur: body.umur ? parseInt(body.umur) : null,

hubungan: body.hubungan || null,

nomor_wa: body.nomor_wa || null,

},

});


// Respons sukses dengan Status 201 Created

return NextResponse.json({

message: "Anggota berhasil ditambahkan.",

data: anggotaBaru,

}, { status: 201 });

} catch (error) {

// Log error di konsol server untuk debugging

console.error("Error saat menambah anggota baru:", error);

// Respons error 500 yang jelas ke frontend

return NextResponse.json({

error: "Gagal menambah anggota. Cek log server untuk detail kesalahan."

}, { status: 500 });

}

}


// Hapus atau ganti inisialisasi Prisma Client jika Anda sudah menggunakan file prismaclient.ts terpusat.