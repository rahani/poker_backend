import { Card, CardDocument } from "../card/Card";
import { DeckDocument } from "./Deck";

export async function draw(
  this: DeckDocument,
  count: number
): Promise<CardDocument[]> {
  // handle mongoose this

  const cardIds = this.cards.splice(0, count);
  this.save();
  return cardIds;
}
