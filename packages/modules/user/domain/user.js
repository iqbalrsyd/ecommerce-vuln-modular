function findByEmail(db, email) {
  return db.inMemoryDb.users.find((u) => u.email === email);
}

module.exports = { findByEmail };
