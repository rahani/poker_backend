import { Request, Response } from "express";
import logger from "../../util/logger";
import { Card, CardLean } from "../../models/card/Card";
import { Deck } from "../../models/deck/Deck";
import * as MUUID from "uuid-mongodb";
import { DeckCreateResponse } from "./create";

const mUUID = MUUID.mode("relaxed");

export interface DeckDrawRequest {
  deckId: string;
  count: number;
}

export interface DeckDrawResponse {
  cards: CardLean[];
}

/**
 * Contact form API.
 * @route POST /deck/draw
 */
export const deckDrawController = async (req: Request, res: Response) => {
  const { deckId, count }: DeckDrawRequest = req.body;

  /**
   * get deck by id
   * if deck not found return 404
   * check if deck has enough cards
   * if not return 400
   * if yes
   * get the cards IDs
   * remove the cards from deck
   * update the deck
   * get the cards by IDS
   * return the cards
   * return 200
   */

  try {
    const deck = await Deck.findById(mUUID.from(deckId), {});

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    if (deck.remainings < count) {
      return res.status(400).json({ error: "Not enough cards" });
    }

    const cardIds = await deck.draw(count);
    const cards = await Card.find({ _id: { $in: cardIds } }, { _id: 0 });

    return res.status(200).json({ cards });
  } catch (err) {
    /**
     * log the error
     * return a 500
     */
    logger.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
