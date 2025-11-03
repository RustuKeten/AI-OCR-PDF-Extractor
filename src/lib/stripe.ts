import Stripe from "stripe";

// Initialize Stripe only if secret key is available (for build time compatibility)
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  : (null as unknown as Stripe); // Type assertion for build time

// Helper to get stripe instance with error checking
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
  return stripe;
}

// Credit amounts for each plan
export const PLAN_CREDITS = {
  FREE: 1000,
  BASIC: 10000,
  PRO: 20000,
} as const;

// Credit cost per file extraction
export const CREDITS_PER_FILE = 100;

