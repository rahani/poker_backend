import request from "supertest";
import app from "../../../src/app";
import { describe, expect, it } from "@jest/globals";

import { DeckCreateRequest } from "../../../src/controllers/deck/create";
import { DeckTypeEnum } from "../../../src/models/deck/Deck";
const CONTENT_TYPE_JSON = "application/json; charset=utf-8";

describe("POST /deck/create", () => {
  const validRequestShort: DeckCreateRequest = {
    shuffled: true,
    type: DeckTypeEnum.SHORT,
  };
  const validRequestFull: DeckCreateRequest = {
    shuffled: true,
    type: DeckTypeEnum.FULL,
  };

  const unvalidRequest = {
    shuffled: true,
    type: "X",
  };

  it("should return 400 BAD REQ for Unvalid request params", () => {
    return request(app)
      .post("/deck/create/")
      .send(unvalidRequest)
      .expect(400)
      .expect("Content-Type", CONTENT_TYPE_JSON);
  });

  it("should return 200 OK for valid params", () => {
    // send a valid POST request to the endpoint
    return request(app)
      .post("/deck/create/")
      .send(validRequestShort)
      .expect(200)
      .expect("Content-Type", CONTENT_TYPE_JSON);
  });

  it("should return 200 OK and valid response for type short", async () => {
    // send a valid POST request to the endpoint
    const response = await request(app)
      .post("/deck/create/")
      .send(validRequestShort);

    expect(response.status).toBe(200);

    /** deckID */
    expect(response.body).toHaveProperty("deckId");
    expect(typeof response.body.deckId).toBe("string");

    /** type */
    expect(response.body).toHaveProperty("type");
    expect(typeof response.body.type).toBe("string");
    expect(response.body.type).toBe(validRequestShort.type);

    /** shuffled */
    expect(response.body).toHaveProperty("shuffled");
    expect(response.body.shuffled).toBe(validRequestShort.shuffled);
    expect(typeof response.body.shuffled).toBe("boolean");

    /** remaining */
    expect(response.body).toHaveProperty("remaining");
    expect(typeof response.body.remaining).toBe("number");
    expect(response.body.remaining).toBe(32);
  });

  it("should return 200 OK and valid response for type FULL", async () => {
    // send a valid POST request to the endpoint
    const response = await request(app)
      .post("/deck/create/")
      .send(validRequestFull);

    expect(response.status).toBe(200);

    /** deckID */
    expect(response.body).toHaveProperty("deckId");
    expect(typeof response.body.deckId).toBe("string");

    /** type */
    expect(response.body).toHaveProperty("type");
    expect(typeof response.body.type).toBe("string");
    expect(response.body.type).toBe(validRequestFull.type);

    /** shuffled */
    expect(response.body).toHaveProperty("shuffled");
    expect(response.body.shuffled).toBe(validRequestFull.shuffled);
    expect(typeof response.body.shuffled).toBe("boolean");

    /** remaining */
    expect(response.body).toHaveProperty("remaining");
    expect(typeof response.body.remaining).toBe("number");
    expect(response.body.remaining).toBe(52);
  });
});
