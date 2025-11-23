package minesweeper.api

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameController {

    @GetMapping("/ping")
    fun ping(): Map<String, String> =
        mapOf("status" to "ok", "message" to "Minesweeper backend is alive")
}
