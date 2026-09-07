import { Schema, model, Document } from "mongoose";
export interface OrganizerDocument extends Document { name: string; email: string; passwordHash: string; orgName: string; logoUrl?: string; }
const schema = new Schema<OrganizerDocument>({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, index: true }, passwordHash: { type: String, required: true }, orgName: { type: String, required: true }, logoUrl: String }, { timestamps: true });
export const Organizer = model<OrganizerDocument>("Organizer", schema);
