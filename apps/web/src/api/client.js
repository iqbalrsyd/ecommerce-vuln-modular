async function api(path, init) {
  const res = await fetch(`/api${path}`, init);
  return res.json();
}

export const products = {
  list: () => api("/products"),
  get: (id) => api(`/products/${id}`),
  review: (id, body) =>
    api(`/products/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};

export const cart = {
  create: () =>
    api("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }),
  update: (id, body) =>
    api(`/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};

export const checkout = {
  submit: (body) =>
    api("/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};

export const payment = {
  charge: (body) =>
    api("/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};

export const orders = {
  list: () => api("/orders"),
  get: (id) => api(`/orders/${id}`),
};

export const auth = {
  register: (body) =>
    api("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  login: (body) =>
    api("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
