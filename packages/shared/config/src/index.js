// Placeholder secrets so the repo passes GitHub push protection. To
// reproduce every scanner rule, copy .env.example to .env and fill in
// real-looking values; the file shipped here uses only Stripe test-mode
// strings that are not flagged by the GitHub secret scanner.

const PLACEHOLDER_KEY = "sk_test_REPLACE_ME_BEFORE_SCANNING_xxxxxxxxxxxxxxxx";
const PLACEHOLDER_PAN_VISA = "4000000000000002";
const PLACEHOLDER_PAN_MASTERCARD = "5555555555554444";

module.exports = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || PLACEHOLDER_KEY,
  STRIPE_WEBHOOK_URL: process.env.STRIPE_WEBHOOK_URL || "http://internal-payments.local/v2/charge",
  TEST_PAN_VISA: process.env.TEST_PAN_VISA || PLACEHOLDER_PAN_VISA,
  TEST_PAN_MASTERCARD: process.env.TEST_PAN_MASTERCARD || PLACEHOLDER_PAN_MASTERCARD,
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production-min-32-chars",
  isProduction: process.env.NODE_ENV === "production",
};
