package minesweeper.api

import minesweeper.api.dto.CoordinateRequest
import minesweeper.api.dto.GameStateDto
import minesweeper.api.dto.NewGameRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameController(
    private val gameService: GameService
) {

    @GetMapping("/ping")
    fun ping(): Map<String, String> =
        mapOf("status" to "ok", "message" to "Minesweeper backend is alive")

    @PostMapping
    fun createGame(@RequestBody request: NewGameRequest): GameStateDto {
        return gameService.createGame(request)
    }

    @GetMapping("/{id}")
    fun getGame(@PathVariable id: String): ResponseEntity<GameStateDto> {
        val state = gameService.getGameState(id)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(state)
    }

    @PostMapping("/{id}/reveal")
    fun reveal(
        @PathVariable id: String,
        @RequestBody body: CoordinateRequest
    ): ResponseEntity<GameStateDto> {
        val state = gameService.reveal(id, body.x, body.y)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(state)
    }

    @PostMapping("/{id}/toggle-mark")
    fun toggleMark(
        @PathVariable id: String,
        @RequestBody body: CoordinateRequest
    ): ResponseEntity<GameStateDto> {
        val state = gameService.toggleMark(id, body.x, body.y)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(state)
    }

    @PostMapping("/{id}/auto-expand")
    fun autoExpand(
        @PathVariable id: String,
        @RequestBody body: CoordinateRequest
    ): ResponseEntity<GameStateDto> {
        val state = gameService.autoExpand(id, body.x, body.y)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(state)
    }
}
