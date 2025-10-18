import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { username, noWa } = await req.json()

    // Cek user berdasarkan nama & nomor_wa
    const user = await prisma.user.findFirst({
      where: {
        nama: username,
        nomor_wa: noWa
      }
    })

    if (!user) {
      return Response.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      )
    }

    return Response.json(
      { success: true, message: "Login berhasil", user },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
