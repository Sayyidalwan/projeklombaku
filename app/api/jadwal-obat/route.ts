import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Ambil semua jadwal minum obat
export async function GET() {
  try {
    const data = await prisma.jadwalObat.findMany({
      select: {
        jadwal_id: true,
        jam_minum: true,
        status: true,
        obat: {
          select: {
            nama_obat: true,
            anggota: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });

    const formatted = data.map((j) => ({
      jadwal_id: j.jadwal_id,
      jam_minum: j.jam_minum.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: j.status,
      nama_obat: j.obat.nama_obat,
      anggota_nama: j.obat.anggota.nama,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Gagal ambil jadwal:", err);
    return NextResponse.json({ error: "Gagal memuat jadwal obat" }, { status: 500 });
  }
}

// Ubah status minum obat
export async function PATCH(req: Request, { params }: any) {
  try {
    const { status } = await req.json();
    const jadwalId = Number(params?.id);

    await prisma.jadwalObat.update({
      where: { jadwal_id: jadwalId },
      data: { status },
    });

    return NextResponse.json({ message: "Status diperbarui" });
  } catch (err) {
    console.error("Gagal update status:", err);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}
