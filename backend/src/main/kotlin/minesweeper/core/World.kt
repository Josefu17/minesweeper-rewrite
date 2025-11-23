package minesweeper.core

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
                Block(r, c, BlockType.BLANK)
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


    fun getState(x: Int, y: Int): BlockType = grid[x][y].blockType

    fun getState(coordinate: Coordinate): BlockType = grid[coordinate.x][coordinate.y].blockType

    fun isMine(x: Int, y: Int): Boolean = grid[x][y].originalType == BlockType.MINE

    fun isMine(coordinate: Coordinate): Boolean = isMine(coordinate.x, coordinate.y)

    /**
     * Modify visible state of a block.
     * For DISCOVERED we compute the adjacent mine count.
     */
    fun modifyBlock(coordinate: Coordinate, blockType: BlockType) {
        if (isOutOfBounds(coordinate)) {
            logger.warn("Ignoring modifyBlock for out-of-bounds coordinate: {}", coordinate)
            return
        }

        val (x, y) = coordinate
        val block = grid[x][y]

        if (blockType == BlockType.DISCOVERED) {
            val adjacentMinesCount = getAdjacentMinesCount(coordinate)
            block.modifyDiscovered(adjacentMinesCount)
        } else {
            block.modify(blockType)
        }
    }

    fun isOutOfBounds(coordinate: Coordinate): Boolean = !isInBounds(coordinate.x, coordinate.y)

    private fun isInBounds(x: Int, y: Int): Boolean = x in 0 until rows && y in 0 until columns

    /**
     * Returns the number of adjacent mines to the given coordinate.
     */
    fun getAdjacentMinesCount(coordinate: Coordinate): Int {
        var mines = 0

        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue

                val checkX = coordinate.x + dx
                val checkY = coordinate.y + dy

                if (isInBounds(checkX, checkY) && isMine(checkX, checkY)) {
                    mines++
                }
            }
        }

        return mines
    }

    /**
     * Recursively reveals safe areas (Flood Fill).
     */
    fun revealSafeBlocks(coordinate: Coordinate) {
        if (isMine(coordinate) || getState(coordinate) == BlockType.DISCOVERED) {
            return
        }

        val adjacentMines = getAdjacentMinesCount(coordinate)
        decrementHiddenSafeBlocks()
        if (adjacentMines == 0) {
            modifyBlock(coordinate, BlockType.BLANK)
            expand(coordinate)
        } else {
            modifyBlock(coordinate, BlockType.DISCOVERED)
        }
    }

    fun revealSafeBlocks(x: Int, y: Int) = revealSafeBlocks(Coordinate(x, y))

    /**
     * Triggers checks on all valid neighbors.
     */
    fun expand(coordinate: Coordinate) {
        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue

                val nx = coordinate.x + dx
                val ny = coordinate.y + dy

                if (isInBounds(nx, ny) && getState(nx, ny) == BlockType.UNKNOWN) {
                    revealSafeBlocks(nx, ny)
                }
            }
        }
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
        val isInvalidExpand = getNumberOfAdjacentFlags(coordinate) != getAdjacentMinesCount(coordinate)

        if (previousState != BlockType.DISCOVERED || isInvalidExpand) {
            // revert state
            modifyBlock(coordinate, previousState)
            return -1
        }

        var hitMines = 0

        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue

                val nx = coordinate.x + dx
                val ny = coordinate.y + dy

                if (isInBounds(nx, ny)) {
                    val state = getState(nx, ny)

                    if (state == BlockType.UNKNOWN) {
                        if (peekAndModifyIfMine(nx, ny)) {
                            hitMines++
                        } else {
                            revealSafeBlocks(nx, ny)
                        }

                    } else if (state == BlockType.MARKED && grid[nx][ny].originalType == BlockType.BLANK) {
                        // safe spot incorrectly marked by the player
                        modifyBlock(Coordinate(nx, ny), BlockType.UNKNOWN)
                    }
                }
            }
        }

        modifyBlock(coordinate, BlockType.DISCOVERED)

        if (hitMines > 0) {
            logger.info("forceExpand hit {} mines at {}", hitMines, coordinate)
        }

        return hitMines
    }

    private fun getNumberOfAdjacentFlags(coordinate: Coordinate): Int {
        var flags = 0

        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue

                val nx = coordinate.x + dx
                val ny = coordinate.y + dy

                if (isInBounds(nx, ny) && getState(nx, ny) == BlockType.MARKED) {
                    flags++
                }
            }
        }

        return flags
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