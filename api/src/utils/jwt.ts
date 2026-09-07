import jwt from "jsonwebtoken"; import { config } from "../config";
export type AuthPayload = { organizerId: string; email: string };
export const signAuthToken = (payload: AuthPayload) => jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
export const signQrToken = (payload: { ticketId: string; eventId: string }) => jwt.sign({ ...payload, purpose: "ticket-qr" }, config.jwtSecret, { expiresIn: "10y" });
export const verifyQrToken = (token: string) => jwt.verify(token, config.jwtSecret) as { ticketId: string; eventId: string; purpose: string };
