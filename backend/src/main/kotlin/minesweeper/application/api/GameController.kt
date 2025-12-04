package minesweeper.application.api

import jakarta.validation.Valid
import minesweeper.api.GameService
import minesweeper.application.api.request.CoordinateRequest
import minesweeper.application.api.request.NewGameRequest
import minesweeper.application.api.request.SubmitScoreRequest
import minesweeper.application.api.response.GameStateDto
import minesweeper.infrastructure.model.Score
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
    fun createGame(@RequestBody @Valid request: NewGameRequest): GameStateDto {
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

    @PostMapping("/{id}/score")
    fun submitScore(
        @PathVariable id: String,
        @RequestBody body: SubmitScoreRequest
    ): ResponseEntity<Score> {
        val score = gameService.submitScore(id, body.playerName)
            ?: return ResponseEntity.badRequest().build()
        return ResponseEntity.ok(score)
    }
}
