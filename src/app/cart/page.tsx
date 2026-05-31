import { CartView } from "@/features/cart/CartView";

export const metadata = {
  title: "Cart",
  description: "Review your AURORA selections before checkout.",
};

export default function CartPage() {
  return <CartView />;
}
