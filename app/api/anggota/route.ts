import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET = ambil data anggota aktif
export async function GET() {
  try {
    const anggota = await prisma.keluargaAnggota.findMany({
      where: { is_active: true },
      select: {
        anggota_id: true,
        nama: true,
        umur: true,
        hubungan: true,
        nomor_wa: true,
      },
    });

    return NextResponse.json(anggota);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data anggota" }, { status: 500 });
  }
}

// POST = tambah data anggota baru
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // sementara: user_id diset manual (misal 1) karena relasi wajib
    const user_id = 1;

    const anggotaBaru = await prisma.keluargaAnggota.create({
      data: {
        user_id,
        nama: body.nama,
        umur: body.umur ? parseInt(body.umur) : null,
        hubungan: body.hubungan || null,
        nomor_wa: body.nomor_wa || null,
      },
    });

    return NextResponse.json({
      message: "Anggota berhasil ditambahkan",
      data: anggotaBaru,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menambah anggota" }, { status: 500 });
  }
}
