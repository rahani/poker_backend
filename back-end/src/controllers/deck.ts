import { Request, Response } from "express";
import { FilterQuery, ObjectId } from "mongoose";
import logger from "../util/logger";
import { Card, CardDocument, CardLean } from "../models/card/Card";
import { DeckTypeEnum } from "../models/deck/Deck";
import { Deck } from "../models/deck/Deck";
import * as MUUID from "uuid-mongodb";
const mUUID = MUUID.mode("relaxed");

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

export interface DeckOpenRequest {
  deckId: string;
}

export interface DeckOpenResponse extends DeckCreateResponse {
  cards: CardLean[];
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
