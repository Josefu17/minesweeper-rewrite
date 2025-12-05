package minesweeper.infrastructure.repository

import minesweeper.domain.Difficulty
import minesweeper.infrastructure.model.Score
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ScoreRepository : JpaRepository<Score, Long> {

    // Fetch top 10 scores for a difficulty, ordered by time (fastest first)
    @Query("""
        SELECT s 
        FROM Score s 
        WHERE s.difficulty = :difficulty 
        ORDER BY s.timeSeconds ASC, s.playedAt ASC
    """)
    fun findTopScores(difficulty: Difficulty, pageable: Pageable): List<Score>
}