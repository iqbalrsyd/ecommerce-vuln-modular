const inMemoryDb = {
  users: [],
  products: [
    { id: 1, name: "Vintage Tee", price: 25.0, stock: 10 },
    { id: 2, name: "Coffee Beans 1kg", price: 18.5, stock: 50 },
    { id: 3, name: "Wireless Mouse", price: 32.0, stock: 25 },
  ],
  orders: [],
  carts: [],
  reviews: [],
};

function query(sql) {
  return new Promise((resolve) => {
    console.log("[db.query]", sql);
    setTimeout(() => resolve([]), 5);
  });
}

function save(table, row) {
  inMemoryDb[table].push(row);
  return row;
}

module.exports = { inMemoryDb, query, save };
