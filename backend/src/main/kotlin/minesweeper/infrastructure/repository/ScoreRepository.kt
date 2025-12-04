package minesweeper.infrastructure.repository

import minesweeper.domain.Difficulty
import minesweeper.infrastructure.model.Score
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ScoreRepository : JpaRepository<Score, Long> {

    // Fetch top 10 scores for a difficulty, ordered by time (fastest first)
    fun findByDifficultyOrderByTimeSecondsAsc(difficulty: Difficulty, pageable: Pageable): List<Score>
}