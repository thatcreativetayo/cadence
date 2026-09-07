import "dotenv/config";

const required = ["MONGO_URI", "JWT_SECRET", "PAYSTACK_SECRET_KEY", "PAYSTACK_WEBHOOK_SECRET", "RESEND_API_KEY"] as const;
for (const key of required) if (!process.env[key]) console.warn(`Missing environment variable: ${key}`);

export const config = {
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cadence",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  paystackSecret: process.env.PAYSTACK_SECRET_KEY || "",
  paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  dashboardUrl: process.env.FRONTEND_DASHBOARD_URL || "http://localhost:3000/dashboard",
  port: Number(process.env.PORT || 4000)
};
