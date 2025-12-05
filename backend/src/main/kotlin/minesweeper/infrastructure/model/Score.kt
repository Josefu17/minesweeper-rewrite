package minesweeper.infrastructure.model

import jakarta.persistence.*
import minesweeper.domain.Difficulty
import java.time.Instant

@Entity
@Table(name = "SCORES")
data class Score(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "PLAYER_NAME", nullable = false)
    val playerName: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "DIFFICULTY", nullable = false)
    val difficulty: Difficulty,

    // Duration in seconds
    @Column(name = "TIME_SECONDS", nullable = false)
    val timeSeconds: Long,

    @Column(name = "PLAYED_AT", nullable = false)
    val playedAt: Instant = Instant.now()
)