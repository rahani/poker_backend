import { Request, Response } from "express";
import logger from "../../util/logger";
import { CardLean } from "../../models/card/Card";
import { Deck } from "../../models/deck/Deck";
import * as MUUID from "uuid-mongodb";
import { DeckCreateResponse } from "./create";

const mUUID = MUUID.mode("relaxed");

export interface DeckOpenRequest {
  deckId: string;
}

export interface DeckOpenResponse extends DeckCreateResponse {
  cards: CardLean[];
}

/**
 * Contact form API.
 * @route POST /deck/open
 */
export const deckOpenController = async (req: Request, res: Response) => {
  const { deckId }: DeckOpenRequest = req.body;

  /**
   * get deck by id
   * if deck not found return 404
   * if deck found return 200 and deck data
   */

  try {
    const deck = await Deck.findById(mUUID.from(deckId), {}).populate({
      path: "cards",
      select: { _id: 0 },
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    const response: DeckOpenResponse = {
      deckId: deck._id,
      type: deck.type,
      shuffled: deck.shuffled,
      remaining: deck.remainings,
      cards: deck.cards,
    };

    return res.status(200).json(response);
  } catch (err) {
    /**
     * log the error
     * return a 500
     */
    logger.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
