export function renderFromBody(el, req) {
  el.innerHTML = req.body.productName;
  el.innerHTML = req.body.review;
  el.innerHTML = req.body.description;
}

export function renderProductIntoElement(el, productId, fetchFn) {
  return fetchFn(`/api/products/${productId}`).then((product) => {
    el.innerHTML = product.name;
  });
}
