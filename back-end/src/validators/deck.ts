import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { DeckTypeEnum } from "..//models/deck/Deck";

/**
 * error handler for all validators
 * @param req  Request
 * @param res  Response
 * @param next  NextFunction
 * @returns  Response
 */
const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }
  next();
};

/**
 * deckId validator same in both controllers
 */
const deckIdValidator = [
  check("deckId").notEmpty().withMessage("deckId cannot be blank"),
  check("deckId").isString().withMessage("deckId must be a string"),
  check("deckId").isUUID().withMessage("deckId must be a valid UUID"),
];

/**
 * shuffled validator
 */
const shuffledValidator = [
  check("shuffled").notEmpty().withMessage("shuffled cannot be blank"),
  check("shuffled").isBoolean().withMessage("shuffled must be a boolean"),
];
/**
 * deck type validator
 */
const typeValidator = [
  check("type").notEmpty().withMessage("Type cannot be blank"),
  check("type").isString().withMessage("Type must be a string"),
  check("type")
    .isIn(Object.values(DeckTypeEnum))
    .withMessage(
      "Type must be one of the following: " + Object.values(DeckTypeEnum)
    ),
];

/**
 * deck draw count validator
 */
const countValidator = [
  check("count").notEmpty().withMessage("count cannot be blank"),
  check("count").isInt().withMessage("count must be an integer"),
  check("count").isInt({ min: 1, max: 52 }).withMessage("count must be 1-52"),
];

/**
 * deckCreate validator
 */
export const deckCreateValidator = [
  ...typeValidator,
  ...shuffledValidator,
  errorHandler,
];

/**
 * deckOpen validator
 */
export const deckOpenValidator = [...deckIdValidator, errorHandler];

/**
 * deckDraw validator
 */
export const deckDrawValidator = [
  ...deckIdValidator,
  ...countValidator,

  errorHandler,
];
