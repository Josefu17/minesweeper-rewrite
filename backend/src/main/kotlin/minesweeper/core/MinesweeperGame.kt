package minesweeper.core

import org.slf4j.LoggerFactory

class MinesweeperGame(
    rows: Int,
    columns: Int,
    difficulty: Difficulty
) {
    private val logger = LoggerFactory.getLogger(MinesweeperGame::class.java)

    val world: World = World(rows, columns, difficulty)

    var livesLeft: Int = difficulty.lives
        private set

    var status: GameStatus = GameStatus.RUNNING
        private set

    private var isFirstMove: Boolean = true


    /**
     * Reveal/check a block at the given coordinate.
     * Handles first-move mine placement and win/lose logic.
     */
    fun reveal(coordinate: Coordinate) {
        if (status != GameStatus.RUNNING) return

        if (world.isOutOfBounds(coordinate)) {
            logger.debug("Reveal ignored for out-of-bounds coordinate: {}", coordinate)
            return
        }

        val currentState = world.getState(coordinate)
        // Already cleared / revealed
        if (currentState == BlockType.MINE || currentState == BlockType.BLANK) {
            return
        }

        // First move = plant mines, guaranteeing safe starting zone
        if (isFirstMove) {
            world.plantMines(coordinate)
            isFirstMove = false
        }

        if (world.isMine(coordinate)) {
            world.modifyBlock(coordinate, BlockType.MINE)
            handleMineHit(hitMines = 1, at = coordinate)
        } else {
            world.revealSafeBlocks(coordinate)
            if (world.hiddenSafeBlocks == 0) {
                status = GameStatus.WON
                logger.info("Game won (all safe blocks revealed)")
            }
        }
    }


    /**
     * Toggle mark/unmark on a given coordinate.
     */
    fun toggleMark(coordinate: Coordinate) {
        if (status != GameStatus.RUNNING) return

        if (world.isOutOfBounds(coordinate)) {
            logger.debug("Toggle mark ignored for out-of-bounds coordinate: {}", coordinate)
            return
        }

        when (val state = world.getState(coordinate)) {
            BlockType.MARKED -> unmark(coordinate)
            BlockType.UNKNOWN -> mark(coordinate)
            else -> logger.debug("Cannot mark coordinate {} in state {}", coordinate, state)
        }
    }

    /**
     * Auto-expands neighbors if the number of flags matches adjacent mines (Chord).
     */
    fun autoExpand(coordinate: Coordinate) {
        if (status != GameStatus.RUNNING) return

        if (world.isOutOfBounds(coordinate)) {
            logger.debug("Auto-expand ignored for out-of-bounds coordinate: {}", coordinate)
            return
        }

        val previousState = world.getState(coordinate)
        val minesHit = world.forceExpand(coordinate, previousState)

        if (minesHit == -1) {
            // Invalid expand: nothing else to do
            return
        }

        if (minesHit > 0) {
            handleMineHit(hitMines = minesHit, at = coordinate)
        }

        if (world.won()) {
            status = GameStatus.WON
            logger.info("Game won (after auto-expand)")
        }
    }

    private fun mark(coordinate: Coordinate) {
        if (world.marksLeft <= 0) {
            logger.debug("No flags left; cannot mark {}", coordinate)
            return
        }
        world.decrementMarksLeft()
        world.modifyBlock(coordinate, BlockType.MARKED)
    }

    private fun unmark(coordinate: Coordinate) {
        world.incrementMarksLeft()
        world.modifyBlock(coordinate, BlockType.UNKNOWN)
    }

    /**
     * Handles the "second chance" mechanic.
     * - If no livesLeft -> game over.
     * - If livesLeft > 0 -> consume extra life, game continues.
     */
    private fun handleMineHit(hitMines: Int, at: Coordinate) {
        logger.info("Mine hit at {} (hitMines={}, livesLeft={})", at, hitMines, livesLeft)

        // If we don't have enough lives to absorb the hit -> lost
        if (hitMines > livesLeft || livesLeft == 0) {
            status = GameStatus.LOST
            logger.info("Game lost after mine hit at {}", at)
            return
        }

        // "Mighty touch" mechanic: consume lives, but keep playing
        livesLeft = 0
        world.decrementMarksLeft()
        logger.info("Extra life used; game continues, livesLeft={}", livesLeft)
    }
}