import { Request, Response } from "express";
import { FilterQuery, ObjectId } from "mongoose";
import logger from "../util/logger";
import { Card, CardDocument } from "../models/card/Card";
import { DeckTypeEnum } from "../models/deck/Deck";
import { Deck } from "../models/deck/Deck";

// skip values for short deck
const skipValuesShortDeck = ["2", "3", "4", "5", "6"];

export interface DeckCreateRequest {
  type: DeckTypeEnum;
  shuffled: boolean;
}

export interface DeckCreateResponse {
  deckId: string;
  type: DeckTypeEnum;
  shuffled: boolean;
  remaining: number;
}

/**
 * Contact form API.
 * @route POST /deck/create
 */
export const deckCreateController = async (req: Request, res: Response) => {
  /**
   * get the data from the request body
   * and make sure shuffled is boolean
   */

  let { type, shuffled }: DeckCreateRequest = req.body;
  shuffled = Boolean(shuffled);

  /**
   * handle relevant cards filtering (short Deck)
   * handle shuffled filtering
   * get relevant cards IDs
   *
   */
  let filterQuery: FilterQuery<CardDocument> = {};

  if (type === DeckTypeEnum.SHORT) {
    filterQuery = {
      ...filterQuery,
      value: { $nin: skipValuesShortDeck },
    };
  }

  const cardsIds = await Card.find(filterQuery).distinct("_id");

  if (shuffled) {
    // very simple shuffle cardIds
    cardsIds.sort(() => Math.random() - 0.5);
  }

  /**
   * create a new deck
   * add the cards to the deck
   * save the deck
   * return the response
   */

  try {
    const deck = await Deck.create({
      type,
      shuffled,
      cards: cardsIds,
    });

    const response: DeckCreateResponse = {
      deckId: deck._id,
      type,
      shuffled,
      remaining: deck.remainings,
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
