import React from "react";

export default function OrderPage() {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}
