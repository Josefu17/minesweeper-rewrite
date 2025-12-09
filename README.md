# Minesweeper Web

A full-stack implementation of Minesweeper featuring "First-Click Safety," chording mechanics, and a persistent leaderboard.

This project is a complete rewrite of a terminal-based Java version I created during my studies in 2023. I revisited the core logic in 2025 to apply clean architecture principles (DDD) and wrapped it in a modern Web UI.

![Game Screenshot](docs/screenshot_gameplay.png)
*(Placeholder: Add a screenshot of your game board here)*

## Project Overview

The goal was to move away from the command line and create a responsive, robust web application. The backend enforces the game rules, ensuring the client cannot "cheat" by inspecting the state, while the frontend leverages modern reactive patterns for a smooth user experience.

### Features
* **First-Click Safety:** The minefield is generated *after* the first interaction, guaranteeing you never lose on turn one.
* **Smart Auto-Expand (Chording):** If you've flagged the correct number of mines around a cell, clicking the number reveals all safe neighbors automatically.
* **Second Chance:** Medium and Custom difficulties allow for a "Lives" system, forgiving one mistake.
* **Custom Difficulty:** Players can configure grid dimensions (up to 30x30) and mine density.
* **Leaderboard:** Top scores are tracked per difficulty in a PostgreSQL database.

## Architecture & Tech Stack

### Backend (Kotlin)
* **Spring Boot 3:** Handles the REST API and dependency injection.
* **Hexagonal Architecture:** The core domain logic (`MinesweeperGame`, `World`, `Block`) is pure Kotlin and completely isolated from the framework and database code.
* **PostgreSQL:** Stores the high scores.

### Frontend (Angular)
* **Angular 21:** Utilizing the latest features including **Standalone Components** and **Signals** for state management.
* **Angular Material:** Provides the UI components and theming.
* **SCSS:** Custom styling for the game grid and responsive layouts.

### Infrastructure
The app runs via Docker Compose, orchestrating three services:
1.  **Frontend:** Nginx serving static assets and proxying API calls.
2.  **Backend:** The Spring Boot application.
3.  **Database:** Postgres 16 Alpine.

## How to Run

You don't need to install Java or Node.js locally. If you have Docker installed, just run:

```bash
docker compose up -d
````

The game will be available at `http://localhost`.

## Future Improvements

While the core game is complete, here are a few things I'm considering for the future:

* **Internationalization:** Adding German/English language toggles.
* **Dark Mode:** Full theme switching support.

## Credits & Attribution

* **Icons:** UI icons provided by [Google Material Icons](https://fonts.google.com/icons).
* **Game Logo:** Game controller icon sourced from [PNGEgg](https://www.pngegg.com/en/png-idbew).

-----

*Created by Joseph (yours truly) – Nov 2025*
