package minesweeper.domain

import org.junit.jupiter.api.Assertions.assertEquals
import kotlin.test.Test

class WorldTest {
    @Test
    fun `reveal propagates on empty cells (Flood Fill)`() {
        // Arrange
        // Setup: 3x3 grid, NO mines.
        // [0, 0, 0]
        // [0, 0, 0]
        // [0, 0, 0]
        val world = World(rows = 3, columns = 3, mineCount = 0)

        world.debugSetMines(emptyList())

        // Act: Reveal the center
        world.reveal(Coordinate(1, 1))

        // Assert: The WHOLE grid should be revealed
        for (x in 0..2) {
            for (y in 0..2) {
                assertEquals(BlockType.REVEALED, world.getState(Coordinate(x, y)))
            }
        }
    }

    @Test
    fun `reveal stops at numbers`() {
        // Setup: 3x3 grid, Mines in top row
        // [X, X, X]
        // [2, 3, 2]
        // [0, 0, 0]
        val world = World(rows = 3, columns = 3, mineCount = 3)
        world.debugSetMines(
            listOf(
                Coordinate(0, 0), Coordinate(0, 1), Coordinate(0, 2)
            )
        )

        // Act: Reveal bottom-left (should be 0)
        world.reveal(Coordinate(2, 0))

        // Assert
        // (2,0), (2,1), (2,2) are 0s -> Revealed
        // (1,0), (1,1), (1,2) are numbers -> Revealed (boundary of flood fill)
        // (0,x) are mines -> Hidden
        assertEquals(BlockType.REVEALED, world.getState(Coordinate(2, 1))) // 0
        assertEquals(BlockType.REVEALED, world.getState(Coordinate(1, 1))) // 3
        assertEquals(BlockType.HIDDEN, world.getState(Coordinate(0, 1)))   // Mine
    }

    @Test
    fun `forceExpand reveals neighbors when flags are correct`() {
        // Setup: 2x2 Grid. Mine at (0,0).
        // [Mine, 1]
        // [1,    1]
        val world = World(rows = 2, columns = 2, mineCount = 1)
        world.debugSetMines(listOf(Coordinate(0, 0)))

        // Pre-condition: User has revealed (0,1) and flagged (0,0)
        world.reveal(Coordinate(0, 1))
        world.mark(Coordinate(0, 0))

        // Act
        val result = world.forceExpand(Coordinate(0, 1))

        // Assert
        assertEquals(0, result)
        assertEquals(BlockType.REVEALED, world.getState(Coordinate(1, 0)))
        assertEquals(BlockType.REVEALED, world.getState(Coordinate(1, 1)))
    }

    @Test
    fun `forceExpand fails if flags are missing`() {
        val world = World(rows = 2, columns = 2, mineCount = 1)
        world.debugSetMines(listOf(Coordinate(0, 0)))

        world.reveal(Coordinate(0, 1))
        // NO FLAG

        val result = world.forceExpand(Coordinate(0, 1))

        assertEquals(-1, result)
        assertEquals(BlockType.HIDDEN, world.getState(Coordinate(1, 1)))
    }

    @Test
    fun `forceExpand triggers mine if wrong flag placed`() {
        // Setup: 2x2. Mine at (0,0).
        // [X, 1]
        // [1, 1]
        val world = World(rows = 2, columns = 2, mineCount = 1)
        world.debugSetMines(listOf(Coordinate(0, 0)))

        // User thinks mine is at (1,0) and flags it.
        // [X, 1]
        // [?, 1]
        world.mark(Coordinate(1, 0)) // WRONG FLAG
        world.reveal(Coordinate(0, 1)) // will be auto-expanded
        // User chords on (0,1).
        // [X, chord]
        // [?, 1]
        val result = world.forceExpand(Coordinate(0, 1))

        assertEquals(1, result)
        assertEquals(BlockType.MINE, world.getState(Coordinate(0, 0)))
    }
}