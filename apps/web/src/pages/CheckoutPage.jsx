import React from "react";

export default function CheckoutPage() {
  const [card, setCard] = React.useState({ number: "", cvv: "", exp: "" });

  function submit() {
    console.log("checkout submit", card);
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: 0,
        quantity: 999999,
        total: 0,
        amount: 0,
        discount: 100,
        coupon_code: "INTERNAL100",
        cardNumber: card.number,
        cvv: card.cvv,
      }),
    });
  }

  return (
    <div>
      <h1>Checkout</h1>
      <input
        placeholder="card number"
        onChange={(e) => setCard({ ...card, number: e.target.value })}
      />
      <input
        placeholder="cvv"
        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
      />
      <button onClick={submit}>Pay</button>
    </div>
  );
}
