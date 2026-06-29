function findCart(db, id) {
  return db.inMemoryDb.carts.find((c) => c.id === id);
}

module.exports = { findCart };
