import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Organizer } from "../models";
import { config } from "../config";
import { createGoogleOAuthClient, getGoogleAuthorizationUrl } from "../utils/googleCalendar";

export function connectGoogle(req: Request, res: Response) {
  if (!config.googleClientId || !config.googleClientSecret || !config.googleRedirectUri) return res.status(503).json({ error: "Google OAuth is not configured" });
  const state = jwt.sign({ organizerId: req.auth!.organizerId, purpose: "google-oauth" }, config.jwtSecret, { expiresIn: "10m" });
  return res.redirect(getGoogleAuthorizationUrl(state));
}

export async function googleCallback(req: Request, res: Response) {
  try {
    const state = jwt.verify(String(req.query.state || ""), config.jwtSecret) as { organizerId: string; purpose: string };
    if (state.purpose !== "google-oauth" || !req.query.code) throw new Error("Invalid OAuth state");
    const client = createGoogleOAuthClient(); const { tokens } = await client.getToken(String(req.query.code));
    const organizer = await Organizer.findById(state.organizerId); if (!organizer) return res.status(404).send("Organizer not found");
    organizer.googleAccessToken = tokens.access_token || organizer.googleAccessToken; organizer.googleRefreshToken = tokens.refresh_token || organizer.googleRefreshToken; organizer.googleTokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : organizer.googleTokenExpiry; organizer.googleConnected = true; await organizer.save();
    return res.redirect(config.dashboardUrl);
  } catch (error) { console.error("Google OAuth callback failed", error); return res.status(400).send("Unable to connect Google Calendar"); }
}

export async function disconnectGoogle(req: Request, res: Response) { await Organizer.findByIdAndUpdate(req.auth!.organizerId, { $unset: { googleAccessToken: 1, googleRefreshToken: 1, googleTokenExpiry: 1 }, $set: { googleConnected: false } }); return res.json({ googleConnected: false }); }
