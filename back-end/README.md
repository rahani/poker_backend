# Poker App Backend

This repository provide poker app API.

If you don't prefer to use Docker please follow this Structions.

# Table of contents:

- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [TypeScript + Node](#typescript--node)
  - [Getting TypeScript](#getting-typescript)
  - [Project Structure](#project-structure)
  - [Testing](#testing)

# Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

# Getting started

- Clone the repository

```
git clone https://github.com/rahani/poker_backend.git
```

- Install dependencies

```
cd <project_name>/back-end
npm install
```

- Configure the mongoDB server

```bash
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db

# starting from macOS 10.15 even the admin cannot create directory at root
# so lets create the db directory under the home directory.
mkdir -p ~/data/db
# user account has automatically read and write permissions for ~/data/db.
```

- Start the mongoDB server (you'll probably want another command prompt)

```bash
mongod

# on macOS 10.15 or above the db directory is under home directory
mongod --dbpath ~/data/db
```

- Build and run the project

```
npm run build
npm start
```

Finally, navigate to `http://localhost:3000` and you should see the template being served and rendered locally!

# TypeScript + Node

In the next few sections I will call out everything that changes when adding TypeScript to an Express project.
Note that all of this has already been set up for this project, but feel free to use this as a reference for converting other Node.js projects to TypeScript.

## Getting TypeScript

TypeScript itself is simple to add to any project with `npm`.

```
npm install -D typescript
```

If you're using VS Code then you're good to go!
VS Code will detect and use the TypeScript version you have installed in the `node_modules` folder.
For other editors, make sure you have the corresponding [TypeScript plugin](http://www.typescriptlang.org/index.html#download-links).

## Project Structure

The most obvious difference in a TypeScript + Node project is the folder structure.
In a TypeScript project, it's best to have separate _source_ and _distributable_ files.
TypeScript (`.ts`) files live in the `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.
The `test` and `views` folders remain top level as expected.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **.vscode**              | Contains VS Code specific settings                                                            |
| **.github**              | Contains GitHub settings and configurations, including the GitHub Actions workflows            |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **src/controllers**      | Controllers define functions that respond to various http requests                            |
| **src/models**           | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB  |
| **src/types**            | Holds .d.ts files not found on DefinitelyTyped. Covered more in this [section](#type-definition-dts-files)          |
| **src**/server.ts        | Entry point to your express app                                                               |
| **test**                 | Contains your tests. Separate from source because there is a different build process.         |
| jest.config.js           | Used to configure Jest running tests written in TypeScript                                    |
| package.json             | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                          |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tsconfig.tests.json      | Config settings for compiling tests written in TypeScript                                     |
| .eslintrc                | Config settings for ESLint code style checking                                                |
| .eslintignore            | Config settings for paths to exclude from linting                                             |


### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).


MAIN COMMANDS ***

| Npm Script           | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `build-ts`           | Compiles all source `.ts` files to `.js` files in the `dist` folder                           |
| `build`              | Full build. Runs ALL build tasks (`build-sass`, `build-ts`, `lint`, `copy-static-assets`)     |
| `debug`              | Performs a full build and then serves the app in watch mode                                   |
| `lint`               | Runs ESLint on project files                                                                  |
| `serve-debug`        | Runs the app with the --inspect flag                                                          |
| `serve`              | Runs node on `dist/server.js` which is the apps entry point                                   |
| `start`              | Does the same as 'npm run serve'. Can be invoked with `npm start`                             |
| `test`***               | Runs tests using Jest test runner                                                             |
| `watch-debug`        | The same as `watch` but includes the --inspect flag so you can attach a debugger              |
| `watch-node`         | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task     |
| `watch-test`         | Runs tests in watch mode                                                                      |
| `watch-ts`           | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed           |
| `watch`***              | Runs all watch tasks (TypeScript, Sass, Node). Use this if you're not touching static assets. |
