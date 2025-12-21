import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db, vinyls, users } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { indexVinyl, indexSeller, removeFromIndex } from "@/lib/search"

// POST - Index a vinyl or update seller index
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, id, action } = body

    if (action === "delete") {
      await removeFromIndex(type, id)
      return NextResponse.json({ success: true })
    }

    if (type === "vinyl") {
      const vinyl = await db.query.vinyls.findFirst({
        where: and(eq(vinyls.id, id), eq(vinyls.userId, userId)),
        with: { user: true },
      })

      if (!vinyl) {
        return NextResponse.json({ error: "Vinyl not found" }, { status: 404 })
      }

      // Only index if it's listed
      if (vinyl.isListed) {
        await indexVinyl({
          ...vinyl,
          sellerName: vinyl.user?.displayName || vinyl.user?.username || undefined,
        })
      }
    } else if (type === "seller") {
      const seller = await db.query.users.findFirst({
        where: and(eq(users.id, userId), eq(users.isSeller, true)),
      })

      if (!seller) {
        return NextResponse.json({ error: "Seller not found" }, { status: 404 })
      }

      await indexSeller(seller)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Index error:", error)
    return NextResponse.json({ error: "Failed to index" }, { status: 500 })
  }
}
