import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await auth();
  const { sessionId } = await params;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { stripePaymentId: sessionId },
      select: { id: true, userId: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: Ensure order belongs to user or user is admin
    if (order.userId !== session.user.id && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error fetching order by session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
