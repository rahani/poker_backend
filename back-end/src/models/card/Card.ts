import mongoose, { Model } from "mongoose";
import { insertInit } from "./insertInit";

export enum CardSuitEnum {
  HEARTS = "HEARTS",
  DIAMONDS = "DIAMONDS",
  SPADES = "SPADES",
  CLUBS = "CLUBS",
}
export enum CardValueEnum {
  ACE = "ACE",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
  JACK = "JACK",
  QUEEN = "QUEEN",
  KING = "KING",
}

export type CardDocument = mongoose.Document & {
  value: CardValueEnum;
  suit: CardSuitEnum;
  code: string;
};

const cardSchema = new mongoose.Schema<CardDocument>(
  {
    value: { type: String, required: true, enum: CardValueEnum },
    suit: { type: String, required: true, enum: CardSuitEnum },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: false }
);

/**
 * card middleware.
 */
cardSchema.pre("save", function save(next) {
  const card = this as CardDocument;
});

/**
 * define static method for pre init card data
 */
interface CardModel extends Model<CardDocument> {
  /** insert initial cards */
  insertInit(): Promise<void>;
}
cardSchema.statics.insertInit = insertInit;

export const Card = mongoose.model<CardDocument, CardModel>("Card", cardSchema);
