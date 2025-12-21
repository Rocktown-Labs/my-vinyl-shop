import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db, vinyls } from "@/lib/db"
import { eq, and } from "drizzle-orm"

// GET - Get a single vinyl
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const vinyl = await db.query.vinyls.findFirst({
      where: eq(vinyls.id, id),
      with: {
        user: true,
      },
    })

    if (!vinyl) {
      return NextResponse.json({ error: "Vinyl not found" }, { status: 404 })
    }

    return NextResponse.json({ vinyl })
  } catch (error) {
    console.error("Error fetching vinyl:", error)
    return NextResponse.json({ error: "Failed to fetch vinyl" }, { status: 500 })
  }
}

// PATCH - Update a vinyl
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    // Only update provided fields
    const allowedFields = [
      "title",
      "artist",
      "genre",
      "year",
      "label",
      "catalogNumber",
      "description",
      "condition",
      "sleeveCondition",
      "vinylCondition",
      "type",
      "images",
      "isListed",
      "isInCollection",
      "price",
      "listingType",
      "startingBid",
      "reservePrice",
      "buyNowPrice",
      "auctionEndDate",
      "quantity",
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "images") {
          updateData[field] = JSON.stringify(body[field])
        } else if (field === "auctionEndDate") {
          updateData[field] = body[field] ? new Date(body[field]) : null
        } else {
          updateData[field] = body[field]
        }
      }
    }

    const [updated] = await db.update(vinyls).set(updateData).where(eq(vinyls.id, id)).returning()

    return NextResponse.json({ vinyl: updated })
  } catch (error) {
    console.error("Error updating vinyl:", error)
    return NextResponse.json({ error: "Failed to update vinyl" }, { status: 500 })
  }
}

// DELETE - Delete a vinyl
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    await db.delete(vinyls).where(eq(vinyls.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting vinyl:", error)
    return NextResponse.json({ error: "Failed to delete vinyl" }, { status: 500 })
  }
}
