const card = { number: "", cvv: "" };

function submit() {
  console.log("checkout submit", card.number, card.cvv, card);
  fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({ cardNumber: card.number, cvv: card.cvv }),
  });
}

submit();
