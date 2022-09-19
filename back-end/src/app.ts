import express from "express";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import { Card } from "./models/card/Card";
import { deckCreateController } from "./controllers/deck/create";
import { deckOpenController } from "./controllers/deck/open";

import {
  deckCreateValidator,
  deckDrawValidator,
  deckOpenValidator,
} from "./validators/deck";
import { deckDrawController } from "./controllers/deck/draw";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose
  .connect(mongoUrl, {})
  .then(() => {
    Card.insertInit();
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl,
    }),
  })
);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

/**
 * Primary app routes.
 */
app.post("/deck/create/", deckCreateValidator, deckCreateController);
app.post("/deck/open/", deckOpenValidator, deckOpenController);
app.post("/deck/draw/", deckDrawValidator, deckDrawController);

// handle 404 response
app.use((_, res) => {
  res.status(404).json({ message: "Endpoint not found in the server" });
});

export default app;
