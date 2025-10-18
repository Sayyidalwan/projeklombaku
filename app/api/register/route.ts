import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Data diterima dari frontend:", body);

    const { nama, nomor_wa} = body;

    const newUser = await prisma.user.create({
      data: { nama, nomor_wa},
    });

    console.log("User berhasil ditambahkan:", newUser);
    return Response.json(newUser);
  } catch (error: any) {
    console.error("Error saat register:", error);
    return new Response("Gagal menambahkan user: " + error.message, { status: 500 });
  }
}
