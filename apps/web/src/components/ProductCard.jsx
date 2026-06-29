import React from "react";

export function renderProductDescription(container, product) {
  container.innerHTML = product.name;
  container.innerHTML = product.description;
}

export function renderReview(container, review) {
  container.innerHTML = review.body;
}

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <h2>
        <div dangerouslySetInnerHTML={{ __html: product.name }} />
      </h2>
      <p dangerouslySetInnerHTML={{ __html: product.description }} />
    </div>
  );
}
