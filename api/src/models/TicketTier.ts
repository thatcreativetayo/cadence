import { Schema, model, Document, Types } from "mongoose";
export type TierStatus = "active" | "sold_out" | "closed";
export interface TicketTierDocument extends Document { eventId: Types.ObjectId; name: string; price: number; quantityCap: number; quantitySold: number; salesStart?: Date; salesEnd?: Date; status: TierStatus; }
const schema = new Schema<TicketTierDocument>({ eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true }, name: { type: String, required: true }, price: { type: Number, required: true, min: 0 }, quantityCap: { type: Number, required: true, min: 1 }, quantitySold: { type: Number, default: 0, min: 0 }, salesStart: Date, salesEnd: Date, status: { type: String, enum: ["active", "sold_out", "closed"], default: "active" } }, { timestamps: true });
export const TicketTier = model<TicketTierDocument>("TicketTier", schema);
