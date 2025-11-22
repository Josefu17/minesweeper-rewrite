package minesweeper

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MinesweeperBackendApplication

fun main(args: Array<String>) {
    runApplication<MinesweeperBackendApplication>(*args)
}
