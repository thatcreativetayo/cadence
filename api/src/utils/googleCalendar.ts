import { google, calendar_v3 } from "googleapis";
import { config } from "../config";
import { OrganizerDocument } from "../models";
import { EventDocument } from "../models";

export function createGoogleOAuthClient() {
  return new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, config.googleRedirectUri);
}

export function getGoogleAuthorizationUrl(state: string) {
  return createGoogleOAuthClient().generateAuthUrl({ access_type: "offline", prompt: "consent", scope: ["https://www.googleapis.com/auth/calendar.events"], state });
}

export function getCalendarClient(organizer: OrganizerDocument) {
  if (!organizer.googleAccessToken) throw new Error("Google Calendar is not connected");
  const client = createGoogleOAuthClient();
  client.setCredentials({ access_token: organizer.googleAccessToken, refresh_token: organizer.googleRefreshToken, expiry_date: organizer.googleTokenExpiry?.getTime() });
  return { auth: client, calendar: google.calendar({ version: "v3", auth: client }) };
}

async function persistRefreshedCredentials(organizer: OrganizerDocument, auth: ReturnType<typeof createGoogleOAuthClient>) {
  const credentials = auth.credentials;
  if (credentials.access_token && credentials.access_token !== organizer.googleAccessToken) organizer.googleAccessToken = credentials.access_token;
  if (credentials.expiry_date && (!organizer.googleTokenExpiry || credentials.expiry_date !== organizer.googleTokenExpiry.getTime())) organizer.googleTokenExpiry = new Date(credentials.expiry_date);
  if (organizer.isModified("googleAccessToken") || organizer.isModified("googleTokenExpiry")) await organizer.save();
}

function resource(event: EventDocument): calendar_v3.Schema$Event {
  return { summary: event.title, description: event.description, location: event.venueType === "physical" ? event.venueAddress : event.onlineLink, start: { dateTime: event.startDateTime.toISOString() }, end: { dateTime: event.endDateTime.toISOString() } };
}

export async function insertGoogleEvent(organizer: OrganizerDocument, event: EventDocument) {
  const client = getCalendarClient(organizer); const response = await client.calendar.events.insert({ calendarId: "primary", requestBody: resource(event) });
  await persistRefreshedCredentials(organizer, client.auth);
  return response.data.id;
}

export async function updateGoogleEvent(organizer: OrganizerDocument, event: EventDocument) { const client = getCalendarClient(organizer); await client.calendar.events.update({ calendarId: "primary", eventId: event.googleEventId!, requestBody: resource(event) }); await persistRefreshedCredentials(organizer, client.auth); }
export async function deleteGoogleEvent(organizer: OrganizerDocument, googleEventId: string) { const client = getCalendarClient(organizer); await client.calendar.events.delete({ calendarId: "primary", eventId: googleEventId }); await persistRefreshedCredentials(organizer, client.auth); }
