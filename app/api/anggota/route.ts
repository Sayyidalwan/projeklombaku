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
const { nama, umur, hubungan, nomor_wa } = body; 
const user_id = 35;

const trimmedNama = nama ? String(nama).trim() : '';
if (!trimmedNama) {
    return NextResponse.json({
        error: "Nama anggota wajib diisi."
    }, { status: 400 }); 
}

const trimmedNomorWa = nomor_wa ? String(nomor_wa).trim() : '';

if (!trimmedNomorWa) {
    return NextResponse.json({
        error: "Nomor WhatsApp wajib diisi."
    }, { status: 400 });
}

const waPattern = /^(62|08)\d{8,13}$/; 

if (!waPattern.test(trimmedNomorWa)) {
    return NextResponse.json({
        error: "Nomor WhatsApp tidak valid"
    }, { status: 400 }); 
}

let umurParsed = null;
if (umur) {
    umurParsed = parseInt(umur);
    if (isNaN(umurParsed) || umurParsed < 1) {
        return NextResponse.json({
            error: "Umur harus berupa angka positif."
        }, { status: 400 }); 
    }
}

const anggotaBaru = await prisma.keluargaAnggota.create({
data: {
user_id: user_id,
nama: trimmedNama,
umur: umurParsed,
hubungan: hubungan || null,
nomor_wa: trimmedNomorWa,
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