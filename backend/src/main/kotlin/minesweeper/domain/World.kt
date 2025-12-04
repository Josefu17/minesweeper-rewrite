package minesweeper.domain

import kotlin.math.abs
import kotlin.random.Random

class World(
    val rows: Int,
    val columns: Int,
    val mineCount: Int
) {
    private val grid: Array<Array<Block>> = Array(rows) { r ->
        Array(columns) { c -> Block(r, c) } // Default: hasMine=false, state=HIDDEN
    }

    // Game State Counters
    var marksLeft: Int = mineCount
        private set

    var hiddenSafeBlocks: Int = (rows * columns) - mineCount
        private set

    // --- PUBLIC ACCESSORS ---
    fun getBlock(row: Int, column: Int): Block = grid[row][column]
    fun getState(c: Coordinate): BlockType = grid[c.x][c.y].state
    fun hasMine(c: Coordinate): Boolean = grid[c.x][c.y].hasMine
    fun decrementMarksLeft() {
        marksLeft--
    }

    // --- SETUP LOGIC ---
    fun plantMines(safeZone: Coordinate) {
        var minesToPlant = mineCount

        while (minesToPlant > 0) {
            val r = Random.nextInt(rows)
            val c = Random.nextInt(columns)

            // Check collision with existing mine OR safe zone
            if (!grid[r][c].hasMine && !isNeighborOrSelf(safeZone, Coordinate(r, c))) {
                grid[r][c].hasMine = true
                minesToPlant--
            }
        }

        // Pre-calculate numbers once mines are planted
        calculateNumbers()
    }

    private fun calculateNumbers() {
        for (r in 0 until rows) {
            for (c in 0 until columns) {
                if (!grid[r][c].hasMine) {
                    grid[r][c].adjacentMines = countNeighborMines(Coordinate(r, c))
                }
            }
        }
    }

    // --- GAMEPLAY ACTIONS ---

    /**
     * The main recursive reveal function (Flood Fill)
     */
    fun reveal(c: Coordinate) {
        val block = grid[c.x][c.y]

        // Base cases to stop recursion
        if (block.state == BlockType.REVEALED || block.state == BlockType.FLAGGED) return
        if (block.hasMine) return // Should be handled by Game class, but safety check

        // REVEAL IT
        block.state = BlockType.REVEALED
        hiddenSafeBlocks--

        // If it's a "Blank" (0 neighbors), expand to neighbors
        if (block.adjacentMines == 0) {
            neighborsOf(c).forEach { reveal(it) }
        }
    }

    fun mark(c: Coordinate) {
        if (marksLeft > 0) {
            grid[c.x][c.y].state = BlockType.FLAGGED
            marksLeft--
        }
    }

    fun unmark(c: Coordinate) {
        grid[c.x][c.y].state = BlockType.HIDDEN
        marksLeft++
    }

    fun setExploded(c: Coordinate) {
        grid[c.x][c.y].state = BlockType.MINE
    }

    // reveal a mine passively (after a loss)
    fun revealMine(c: Coordinate) {
        grid[c.x][c.y].state = BlockType.REVEALED_MINE
    }

    /**
     * CHORDING: Returns count of mines triggered (usually 0, hopefully)
     */
    fun forceExpand(c: Coordinate): Int {
        val block = grid[c.x][c.y]

        // Validation: Must be REVEALED and have matching flags (and revealed mines) around it
        if (block.state != BlockType.REVEALED) return -1

        val neighbors = neighborsOf(c)
        val adjacentFlags = neighbors.count { getState(it) == BlockType.FLAGGED }
        val adjacentRevealedMines = neighbors.count { getState(it) == BlockType.MINE }

        if (adjacentFlags + adjacentRevealedMines != block.adjacentMines) return -1

        var minesTriggered = 0

        neighbors.forEach { neighbor ->
            val neighborBlock = grid[neighbor.x][neighbor.y]

            // Process only HIDDEN neighbors (ignore flags/revealed)
            if (neighborBlock.state == BlockType.HIDDEN) {
                if (neighborBlock.hasMine) {
                    // Oops, player flagged wrong and chorded into a mine
                    neighborBlock.state = BlockType.MINE
                    minesTriggered++
                } else {
                    reveal(neighbor)
                }
            }
        }
        return minesTriggered
    }

    // --- HELPERS ---

    fun won(): Boolean = hiddenSafeBlocks == 0

    fun isOutOfBounds(c: Coordinate): Boolean =
        c.x !in 0 until rows || c.y !in 0 until columns

    private fun countNeighborMines(c: Coordinate): Int = neighborsOf(c).count { grid[it.x][it.y].hasMine }

    private fun neighborsOf(center: Coordinate): List<Coordinate> {
        val list = ArrayList<Coordinate>(8)
        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue // self

                val nx = center.x + dx
                val ny = center.y + dy
                if (nx in 0 until rows && ny in 0 until columns) {
                    list.add(Coordinate(nx, ny))
                }
            }
        }
        return list
    }

    private fun isNeighborOrSelf(center: Coordinate, target: Coordinate): Boolean =
        abs(center.x - target.x) <= 1 && abs(center.y - target.y) <= 1


    // --- TEST HELPERS (Internal only) ---

    /**
     * Clears existing mines and forces specific locations.
     * Re-calculates numbers immediately.
     * Has package-internal access and shouldn't be used outside tests
     */
    internal fun debugSetMines(locations: List<Coordinate>) {
        // 1. Reset the grid
        for (r in 0 until rows) {
            for (c in 0 until columns) {
                grid[r][c].hasMine = false
                grid[r][c].adjacentMines = 0
            }
        }

        // 2. Place new mines
        locations.forEach {
            if (!isOutOfBounds(it)) {
                grid[it.x][it.y].hasMine = true
            }
        }

        // 3. Recalculate
        calculateNumbers()
    }

    /*
    * Print the world state for debugging.
    */
    internal fun printDebug() {
        println("   " + (0 until columns).joinToString(" ") { "$it" })
        println("  " + "--".repeat(columns))
        for (r in 0 until rows) {
            print("$r |")
            for (c in 0 until columns) {
                val block = getBlock(r, c)
                val symbol = when (block.state) {
                    BlockType.FLAGGED -> "F"
                    BlockType.MINE, BlockType.REVEALED_MINE -> "*" // Exploded or revealed after lost game
                    BlockType.HIDDEN if block.hasMine -> "M" // Cheating: Hidden Mine
                    BlockType.HIDDEN -> "."
                    BlockType.REVEALED if block.hasMine -> "X" // Should not happen usually
                    BlockType.REVEALED -> if (block.adjacentMines == 0) " " else block.adjacentMines.toString()
                }
                print(" $symbol")
            }
            println()
        }
        println("\nStats: Mines: $mineCount | Marks Left: $marksLeft | Hidden Safe: $hiddenSafeBlocks")
    }
}