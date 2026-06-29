import React from "react";
import ProductCard from "../components/ProductCard.jsx";

export default function HomePage() {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.rows || []));
  }, []);

  return (
    <div>
      <h1>Shop</h1>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
