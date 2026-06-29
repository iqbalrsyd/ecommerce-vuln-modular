function listProducts(db) {
  return db.inMemoryDb.products;
}

function addReview(db, productId, body) {
  const review = { productId, ...body, createdAt: new Date().toISOString() };
  db.save("reviews", review);
  return review;
}

module.exports = { listProducts, addReview };
