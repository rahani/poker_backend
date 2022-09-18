import mongoose, { Model } from "mongoose";
import * as MUUID from "uuid-mongodb";
import { Card, CardDocument } from "../card/Card";
const mUUID = MUUID.mode("relaxed"); // use relaxed mode

export enum DeckTypeEnum {
  FULL = "FULL",
  SHORT = "SHORT",
}

export type DeckDocument = mongoose.Document & {
  type: DeckTypeEnum;
  shuffled: boolean;
  cards: CardDocument[];
  remainings: number;
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

/**
 * deck middleware.
 */
// deckSchema.pre("save", function save(next) {
//   const deck = this as DeckDocument;
// });

export const Deck = mongoose.model<DeckDocument>("Deck", deckSchema);
