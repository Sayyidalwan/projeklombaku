// app/api/registrasi/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, nomorTelepon } = body;

    if (!nama || !nomorTelepon) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        nama,
        nomorTelepon,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data" },
      { status: 500 }
    );
  }
}
