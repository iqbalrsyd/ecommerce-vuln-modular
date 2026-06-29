import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [reviewBody, setReviewBody] = React.useState("");

  React.useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [id]);

  function submitReview() {
    fetch(`/api/products/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: "guest",
        body: reviewBody,
        productName: product && product.name,
        review: reviewBody,
      }),
    });
  }

  return (
    <div>
      {product && <ProductCard product={product} />}
      <textarea value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} />
      <button onClick={submitReview}>Post review</button>
    </div>
  );
}
