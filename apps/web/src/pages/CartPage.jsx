import React from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  return (
    <div>
      <h1>Cart</h1>
      <Link to="/checkout">Go to checkout</Link>
    </div>
  );
}
