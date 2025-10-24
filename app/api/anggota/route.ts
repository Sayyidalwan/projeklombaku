import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
try {
const dataAnggota = await prisma.keluargaAnggota.findMany();

return NextResponse.json(dataAnggota, { status: 200 });

} catch (error) {
console.error("Error saat mengambil data anggota:", error);

return NextResponse.json({
error: "Gagal memuat data anggota dari database."
}, { status: 500 });
}
}

export async function POST(request: Request) {
try {
const body = await request.json();

const user_id = 35;

const anggotaBaru = await prisma.keluargaAnggota.create({
data: {
user_id: user_id,
nama: body.nama,
umur: body.umur ? parseInt(body.umur) : null,
hubungan: body.hubungan || null,
nomor_wa: body.nomor_wa || null,
},
});

return NextResponse.json({
message: "Anggota berhasil ditambahkan.",
data: anggotaBaru,
}, { status: 201 });

} catch (error) {
console.error("Error saat menambah anggota baru:", error);

return NextResponse.json({
error: "Gagal menambah anggota. Cek log server untuk detail kesalahan."
}, { status: 500 });
}
}
