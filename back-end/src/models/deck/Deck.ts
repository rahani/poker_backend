import mongoose, { Model } from "mongoose";
import * as MUUID from "uuid-mongodb";
import {  CardDocument } from "../card/Card";
import { draw } from "./draw";
const mUUID = MUUID.mode("relaxed"); // use relaxed mode

export enum DeckTypeEnum {
  FULL = "FULL",
  SHORT = "SHORT",
}

export type DeckLean = {
  type: DeckTypeEnum;
  shuffled: boolean;
  cards: CardDocument[];
  remainings: number;
};
export type DeckDocument = mongoose.Document &
  DeckLean & {
    draw: (count: number) => Promise<CardDocument[]>;
  };

const deckSchema = new mongoose.Schema<DeckDocument>(
  {
    _id: {
      type: "object",
      value: { type: "Buffer" },
      default: () => mUUID.v1(),
    },
    type: { type: String, enum: DeckTypeEnum, required: true },
    shuffled: { type: Boolean, required: true },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
  },
  { timestamps: true }
);

deckSchema.virtual("remainings").get(function () {
  return this.cards.length;
});

deckSchema.methods.draw = draw;

/**
 * deck middleware.
 */
// deckSchema.pre("save", function save(next) {
//   const deck = this as DeckDocument;
// });

export const Deck = mongoose.model<DeckDocument>("Deck", deckSchema);
