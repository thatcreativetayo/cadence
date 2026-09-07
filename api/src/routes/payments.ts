import { Router } from "express"; import { paystackWebhook } from "../controllers/ticketController"; const router = Router(); router.post("/paystack/webhook", paystackWebhook); export default router;
