# Poker App Backend

This repository provides poker app API via Docker-compose.

If you don't prefer to use Docker, please follow back-end/README.md structures.

1. [Install Docker Compose](https://docs.docker.com/compose/install/)

2. Clone the repository
   ```bash
   git clone
   ```
3. buil the containers
   ```bash
   docker-compose build
   ```
4. Start the containser
   ```bash
   docker-compose up -d
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

6. Run Integration tests
   ```bash
   docker-compose run nodejs npm run test
   ```
6. Run Unit tests
   ```bash
   Sorry for the inconvenience, I didn't have time to write unit tests.
   ```
7. Close the containers
   ```bash
   docker-compose down
   ```

## Routes

### POST /deck/create

    request body:
    {
        type: FULL | SHORT;
        shuffled: boolean;
    }

    response body:
    {
        deckId: string;
        type: FULL | SHORT;
        shuffled: boolean;
        remaining: number;
    }

### POST /deck/open

    request body:
    {
        deckId: string;
    }

    response body:
    {
        deckId: string;
        type: FULL | SHORT;
        shuffled: boolean;
        remaining: number;
        cards: [{
            code: string;
            value: "ACE" | "KING" | "QUEEN" | "JACK" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
            suit: "HEARTS" , "DIAMONDS" , "CLUBS" , "SPADES";
        }];
    }

### POST /deck/draw

    request body:
    {
        deckId: string;
        count: number;
    }

    response body:
    {
        deckId: string;
        type: FULL | SHORT;
        shuffled: boolean;
        remaining: number;
        cards: [{
            code: string;
            value: "ACE" | "KING" | "QUEEN" | "JACK" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
            suit: "HEARTS" , "DIAMONDS" , "CLUBS" , "SPADES";
        }];
    }
