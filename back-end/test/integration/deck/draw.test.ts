import request from "supertest";
import app from "../../../src/app";
import { describe, expect, it } from "@jest/globals";

import { DeckTypeEnum } from "../../../src/models/deck/Deck";
import { DeckDrawRequest } from "../../../src/controllers/deck/draw";
const CONTENT_TYPE_JSON = "application/json; charset=utf-8";

describe("POST /deck/draw", () => {
  const unExistUUID = "1f5b7990-37aa-11ed-b51c-13d699197e24";
  const unCorrectCount = 100;
  const correctCount = 2;
  const unExistingRequest: DeckDrawRequest = {
    deckId: unExistUUID,
    count: 1,
  };

  const unValidUUID = "123456789";
  const unvalidRequest = {
    deckId: unValidUUID,
    count: unCorrectCount,
  };

  it("should return 400 BAD REQ for Unvalid request params", () => {
    return request(app)
      .post("/deck/draw/")
      .send(unvalidRequest)
      .expect(400)
      .expect("Content-Type", CONTENT_TYPE_JSON);
  });

  it("should return 404 BAD REQ for Un Exist DeckId request", () => {
    return request(app)
      .post("/deck/draw/")
      .send(unExistingRequest)
      .expect(404)
      .expect("Content-Type", CONTENT_TYPE_JSON);
  });

  it("should return 200 OK for valid params", async () => {
    const validUUID: string = (
      await request(app).post("/deck/create/").send({
        shuffled: true,
        type: DeckTypeEnum.SHORT,
      })
    ).body.deckId;
    const validRequest: DeckDrawRequest = {
      deckId: validUUID,
      count: correctCount,
    };

    return request(app)
      .post("/deck/draw/")
      .send(validRequest)
      .expect(200)
      .expect("Content-Type", CONTENT_TYPE_JSON);
  });

  it("should return 200 OK and valid response", async () => {
    const validUUID: string = (
      await request(app).post("/deck/create/").send({
        shuffled: true,
        type: DeckTypeEnum.SHORT,
      })
    ).body.deckId;
    const validRequest: DeckDrawRequest = {
      deckId: validUUID,
      count: correctCount,
    };
    // send a valid POST request to the endpoint
    const response = await request(app).post("/deck/draw/").send(validRequest);
    expect(response.status).toBe(200);

    /** cards */
    expect(response.body).toHaveProperty("cards");
    expect(Array.isArray(response.body.cards)).toBe(true);
  });
});
