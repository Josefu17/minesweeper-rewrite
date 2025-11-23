package minesweeper.core

import minesweeper.core.BlockType.BLANK
import minesweeper.core.BlockType.MARKED
import minesweeper.core.BlockType.UNKNOWN
import org.slf4j.LoggerFactory
import kotlin.math.abs
import kotlin.random.Random

class World(
    val rows: Int,
    val columns: Int,
    difficulty: Difficulty
) {
    private val logger = LoggerFactory.getLogger(World::class.java)
    private val grid: Array<Array<Block>>

    var mineCount: Int
        private set

    var marksLeft: Int
        private set

    var hiddenSafeBlocks: Int
        private set

    init {
        if (rows !in 1..30 || columns !in 1..30) {
            throw IndexOutOfBoundsException("Dimensions might be 30x30 at max. Current: $rows x $columns")
        }

        // Initialize grid with BLANK original type, UNKNOWN visible state
        grid = Array(rows) { r ->
            Array(columns) { c ->
                Block(r, c, BLANK)
            }
        }

        val totalBlocks = rows * columns
        mineCount = (totalBlocks * difficulty.mineRatio).toInt()
        hiddenSafeBlocks = totalBlocks - mineCount
        marksLeft = mineCount

        logger.debug(
            "World initialized: {}x{}, totalBlocks={}, mines={}, difficulty={}",
            rows, columns, totalBlocks, mineCount, difficulty
        )
    }

    /**
     * Public accessor so API layer can map the grid to DTOs.
     */
    fun getBlock(row: Int, column: Int): Block = grid[row][column]

    /**
     * Plants mines EXCEPT around the starting coordinate to ensure a safe start.
     */
    fun plantMines(safeZone: Coordinate) {
        var minesToPlant = mineCount

        while (minesToPlant > 0) {
            val r = Random.nextInt(rows)
            val c = Random.nextInt(columns)
            val candidate = Coordinate(r, c)

            // 1. Don't put a mine where there is already one
            // 2. Don't put a mine on the safeZone or its neighbors
            val block = grid[r][c]
            if (block.originalType != BlockType.MINE && !isNeighborOrSelf(safeZone, candidate)) {
                grid[r][c] = Block(r, c, BlockType.MINE)
                minesToPlant--
            }
        }

        logger.debug("Mines planted, safeZone={}", safeZone)
    }

    private fun isNeighborOrSelf(center: Coordinate, target: Coordinate): Boolean =
        abs(center.x - target.x) <= 1 && abs(center.y - target.y) <= 1

    /**
     * Helper: all valid neighbors of a cell (8-directional).
     */
    private fun neighborsOf(center: Coordinate): List<Coordinate> =
        buildList {
            for (dx in -1..1) {
                for (dy in -1..1) {
                    if (dx == 0 && dy == 0) continue

                    val nx = center.x + dx
                    val ny = center.y + dy
                    if (isInBounds(nx, ny)) {
                        add(Coordinate(nx, ny))
                    }
                }
            }
        }

    /**
     * the game is won if all non-mine blocks have been uncovered.
     */
    fun won(): Boolean = hiddenSafeBlocks == 0

    /**
     * String representation of the current board state (for logging / debugging).
     */
    override fun toString(): String {
        val sb = StringBuilder()

        // Column headers
        sb.append("  ")
        for (c in 0 until columns) {
            sb.append(c).append(' ')
        }

        // Rows
        for (r in 0 until rows) {
            sb.append("\n").append(r).append(' ')
            for (c in 0 until columns) {
                sb.append(grid[r][c].displayChar()).append(' ')
            }
        }

        return sb.toString()
    }

    fun getState(coordinate: Coordinate): BlockType = grid[coordinate.x][coordinate.y].blockType

    fun isMine(x: Int, y: Int): Boolean = grid[x][y].originalType == BlockType.MINE

    fun isMine(coordinate: Coordinate): Boolean = isMine(coordinate.x, coordinate.y)

    /**
     * Modify visible state of a block.
     * For REVEALED we compute the adjacent mine count.
     */
    fun modifyBlock(coordinate: Coordinate, blockType: BlockType) {
        if (isOutOfBounds(coordinate)) {
            logger.warn("Ignoring modifyBlock for out-of-bounds coordinate: {}", coordinate)
            return
        }

        val (x, y) = coordinate
        val block = grid[x][y]

        if (blockType == BlockType.REVEALED) {
            val adjacentMinesCount = getAdjacentMinesCount(coordinate)
            block.modifyRevealed(adjacentMinesCount)
        } else {
            block.modify(blockType)
        }
    }

    fun isOutOfBounds(coordinate: Coordinate): Boolean = !isInBounds(coordinate.x, coordinate.y)

    private fun isInBounds(x: Int, y: Int): Boolean = x in 0 until rows && y in 0 until columns

    /**
     * Returns the number of adjacent mines to the given coordinate.
     */
    fun getAdjacentMinesCount(coordinate: Coordinate): Int =
        neighborsOf(coordinate).count { neighbor -> isMine(neighbor) }

    /**
     * Recursively reveals safe areas (Flood Fill).
     */
    fun revealSafeBlocks(coordinate: Coordinate) {
        if (isMine(coordinate) || getState(coordinate) == BlockType.REVEALED) {
            return
        }

        val adjacentMines = getAdjacentMinesCount(coordinate)
        decrementHiddenSafeBlocks()
        if (adjacentMines == 0) {
            modifyBlock(coordinate, BLANK)
            expand(coordinate)
        } else {
            modifyBlock(coordinate, BlockType.REVEALED)
        }
    }

    /**
     * Triggers checks on all valid neighbors.
     */
    fun expand(coordinate: Coordinate) {
        neighborsOf(coordinate)
            .filter { neighbor -> getState(neighbor) == UNKNOWN }
            .forEach { neighbor -> revealSafeBlocks(neighbor) }
    }

    /**
     * Helper to peek at a block and reveal it if it's a mine.
     */
    fun peekAndModifyIfMine(x: Int, y: Int): Boolean {
        if (grid[x][y].originalType == BlockType.MINE) {
            modifyBlock(Coordinate(x, y), BlockType.MINE)
            return true
        }
        return false
    }

    /**
     * Auto-expands neighbors if the number of flags matches adjacent mines (Chord).
     * @return number of hit mines, or -1 if invalid expand
     */
    fun forceExpand(coordinate: Coordinate, previousState: BlockType): Int {
        val isInvalidExpand =
            getNumberOfAdjacentFlags(coordinate) != getAdjacentMinesCount(coordinate)

        if (previousState != BlockType.REVEALED || isInvalidExpand) {
            // revert state
            modifyBlock(coordinate, previousState)
            return -1
        }

        var hitMines = 0

        neighborsOf(coordinate).forEach { neighbor ->
            val state = getState(neighbor)

            if (state == UNKNOWN) {
                if (peekAndModifyIfMine(neighbor.x, neighbor.y)) {
                    hitMines++
                } else {
                    revealSafeBlocks(neighbor)
                }
            } else if (state == MARKED && grid[neighbor.x][neighbor.y].originalType == BLANK) {
                // safe spot incorrectly marked by the player
                modifyBlock(neighbor, UNKNOWN)
            }
        }

        modifyBlock(coordinate, BlockType.REVEALED)

        if (hitMines > 0) {
            logger.info("forceExpand hit {} mines at {}", hitMines, coordinate)
        }

        return hitMines
    }

    private fun getNumberOfAdjacentFlags(coordinate: Coordinate): Int =
        neighborsOf(coordinate).count { neighbor ->
            getState(neighbor) == MARKED
        }

    fun decrementMarksLeft() {
        marksLeft--
    }

    fun incrementMarksLeft() {
        marksLeft++
    }

    fun decrementHiddenSafeBlocks() {
        hiddenSafeBlocks--
    }
}
