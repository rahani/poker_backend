import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { DeckTypeEnum } from "..//models/deck/Deck";

export const deckCreateValidator = [
  check("type").notEmpty().withMessage("Type cannot be blank"),
  check("type").isString().withMessage("Type must be a string"),
  check("type")
    .isIn(Object.values(DeckTypeEnum))
    .withMessage(
      "Type must be one of the following: " + Object.values(DeckTypeEnum)
    ),
  check("shuffled").notEmpty().withMessage("shuffled cannot be blank"),
  check("shuffled").isBoolean().withMessage("shuffled must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    next();
  },
];

export const deckOpenValidator = [
  check("deckId").notEmpty().withMessage("deckId cannot be blank"),
  check("deckId").isString().withMessage("deckId must be a string"),
  check("deckId").isUUID().withMessage("deckId must be a valid UUID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    next();
  },
];
