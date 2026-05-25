import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your AURORA order — secure, fast, and beautifully simple.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <CheckoutView />
    </main>
  );
}
