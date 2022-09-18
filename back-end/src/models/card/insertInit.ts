import { MongoBulkWriteError } from "mongodb";
import logger from "../../util/logger";
import { Card, CardSuitEnum, CardValueEnum } from "./Card";

/**
 * insert init Cards data and report count inserted
 */
export async function insertInit() {
  /** mongoDB persist to accecpt bulkwrite as any[] */
  let bulkWriteQueries: any[] = [];

  /** create bulk write object for insert Cards list */
  Object.values(CardSuitEnum).forEach((cardSuit) => {
    Object.values(CardValueEnum).forEach((cardValue) => {
      bulkWriteQueries.push({
        insertOne: {
          document: {
            value: cardValue,
            suit: cardSuit,
            code: getCardCode(cardValue, cardSuit),
          },
        },
      });
    });
  });

  /** set ordered false to persist inserting if occured error like duplicate */
  return Card.bulkWrite(bulkWriteQueries, { ordered: false })
    .then((response) => {
      logger.debug(`inserted Card Count ${response.nInserted}`);
    })
    .catch((error) => {
      if ((error as MongoBulkWriteError).name == "MongoBulkWriteError")
        return (error as MongoBulkWriteError).result.nInserted;
      else throw error;
    });
}

function getCardCode(cardValue: CardValueEnum, cardSuit: CardSuitEnum) {
  // check if card value is number
  if (parseInt(cardValue)) return cardValue + cardSuit[0];

  return `${cardValue[0]}${cardSuit[0]}`;
}
