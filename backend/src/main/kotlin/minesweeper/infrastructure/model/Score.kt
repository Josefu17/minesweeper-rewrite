package minesweeper.infrastructure.model

import jakarta.persistence.*
import minesweeper.domain.Difficulty
import java.time.Instant

@Entity
@Table(name = "scores")
data class Score(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val playerName: String,

    @Enumerated(EnumType.STRING)
    val difficulty: Difficulty,

    // Duration in seconds
    val timeSeconds: Long,

    val playedAt: Instant = Instant.now()
)