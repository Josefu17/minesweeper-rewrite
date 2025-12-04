package minesweeper.core

import org.slf4j.LoggerFactory

class MinesweeperGame(
    rows: Int,
    columns: Int,
    mineCount: Int,
    lives: Int
) {
    private val logger = LoggerFactory.getLogger(MinesweeperGame::class.java)

    val world = World(rows, columns, mineCount)

    var livesLeft: Int = lives
        private set
    var status: GameStatus = GameStatus.RUNNING
        private set
    private var isFirstMove: Boolean = true

    fun reveal(c: Coordinate) {
        if (status != GameStatus.RUNNING) return
        if (world.isOutOfBounds(c)) {
            logger.info("Reveal called for out of bounds coordinate: ${c.x}x${c.y}. Ignoring.")
            return
        }

        // Guard: Don't reveal flags or already revealed
        val currentState = world.getState(c)
        if (currentState != BlockType.HIDDEN) return

        if (isFirstMove) {
            world.plantMines(c)
            isFirstMove = false
        }

        if (world.hasMine(c)) {
            world.setExploded(c)
            handleMineHit(1, c)
        } else {
            world.reveal(c)
            checkWin()
        }
    }

    fun toggleMark(c: Coordinate) {
        if (status != GameStatus.RUNNING) return
        if (world.isOutOfBounds(c)) return

        when (world.getState(c)) {
            BlockType.HIDDEN -> world.mark(c)
            BlockType.FLAGGED -> world.unmark(c)
            else -> {} // Do nothing for REVEALED or MINE
        }
    }

    fun autoExpand(c: Coordinate) {
        if (status != GameStatus.RUNNING) return
        if (world.isOutOfBounds(c)) return

        val minesHit = world.forceExpand(c)

        if (minesHit > 0) {
            handleMineHit(minesHit, c)
        } else if (minesHit == 0) {
            // If expand was valid and safe, check win
            checkWin()
        }
        // if -1, invalid expand, do nothing
    }

    private fun checkWin() {
        if (world.won()) {
            status = GameStatus.WON
            logger.info("Game WON!")
            autoFlagRemainingMines()
        }
    }

    private fun handleMineHit(hitMines: Int, at: Coordinate) {
        if (hitMines > livesLeft || livesLeft == 0) {
            status = GameStatus.LOST
            logger.info("Game LOST at $at")
        } else {
            livesLeft = 0
            // Logic: You hit a mine, but survived.
            // The mine is now visible (EXPLODED state), but game is RUNNING.
            world.decrementMarksLeft()
            logger.info("Extra life used!")
        }
    }

    private fun autoFlagRemainingMines() {
        for (r in 0 until world.rows) {
            for (c in 0 until world.columns) {
                val coord = Coordinate(r, c)

                if (world.getState(coord) == BlockType.HIDDEN) {
                    world.mark(coord)
                }
            }
        }
    }

    // --- TEST HELPERS ---
    internal fun debugSetFirstMove(isFirst: Boolean) {
        this.isFirstMove = isFirst
    }
}
