function findOrder(db, id) {
  return db.inMemoryDb.orders.find((o) => o.id === id);
}

function listOrders(db) {
  return db.inMemoryDb.orders;
}

module.exports = { findOrder, listOrders };
