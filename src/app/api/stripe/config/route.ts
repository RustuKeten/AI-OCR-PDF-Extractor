import { NextResponse } from "next/server";

export async function GET() {
  try {
    const publicKey = process.env.STRIPE_PUBLIC_KEY;

    if (!publicKey) {
      return NextResponse.json(
        { error: "Stripe public key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      publicKey: publicKey,
    });
  } catch (error: unknown) {
    console.error("Error fetching Stripe config:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
