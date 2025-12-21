import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db, vinyls } from "@/lib/db"
import { eq, and } from "drizzle-orm"

// POST - Convert collection item to listing
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Verify ownership
    const existing = await db.query.vinyls.findFirst({
      where: and(eq(vinyls.id, id), eq(vinyls.userId, userId)),
    })

    if (!existing) {
      return NextResponse.json({ error: "Vinyl not found or unauthorized" }, { status: 404 })
    }

    const body = await request.json()
    const { price, listingType, startingBid, reservePrice, buyNowPrice, auctionEndDate } = body

    const [updated] = await db
      .update(vinyls)
      .set({
        isListed: true,
        price,
        listingType: listingType || "fixed",
        startingBid,
        reservePrice,
        buyNowPrice,
        auctionEndDate: auctionEndDate ? new Date(auctionEndDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(vinyls.id, id))
      .returning()

    return NextResponse.json({ vinyl: updated })
  } catch (error) {
    console.error("Error listing vinyl:", error)
    return NextResponse.json({ error: "Failed to list vinyl" }, { status: 500 })
  }
}

// DELETE - Remove listing (back to collection only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const [updated] = await db
      .update(vinyls)
      .set({
        isListed: false,
        updatedAt: new Date(),
      })
      .where(and(eq(vinyls.id, id), eq(vinyls.userId, userId)))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Vinyl not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ vinyl: updated })
  } catch (error) {
    console.error("Error unlisting vinyl:", error)
    return NextResponse.json({ error: "Failed to unlist vinyl" }, { status: 500 })
  }
}
