function calculateTotal(items, discount = 0) {
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  return Math.max(0, subtotal - discount);
}

module.exports = { calculateTotal };
