export interface HighScore {
  score: number
  date: string
  initials: string
}

export interface GameHighScores {
  [gameName: string]: HighScore[]
}

const HIGH_SCORES_KEY = 'retro-games-high-scores'
const MAX_HIGH_SCORES = 5

export const getHighScores = (gameName: string): HighScore[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const allScores = localStorage.getItem(HIGH_SCORES_KEY)
    if (!allScores) return []
    
    const parsed: GameHighScores = JSON.parse(allScores)
    return parsed[gameName] || []
  } catch (error) {
    console.error('Error loading high scores:', error)
    return []
  }
}

export const saveHighScore = (gameName: string, score: number, initials: string = 'AAA'): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const allScores = localStorage.getItem(HIGH_SCORES_KEY)
    const parsed: GameHighScores = allScores ? JSON.parse(allScores) : {}
    
    if (!parsed[gameName]) {
      parsed[gameName] = []
    }
    
    const newScore: HighScore = {
      score,
      date: new Date().toLocaleDateString(),
      initials: initials.toUpperCase().substring(0, 3).padEnd(3, 'A')
    }
    
    parsed[gameName].push(newScore)
    parsed[gameName].sort((a, b) => b.score - a.score)
    parsed[gameName] = parsed[gameName].slice(0, MAX_HIGH_SCORES)
    
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(parsed))
    
    // Return true if this score made it to the high scores list
    return parsed[gameName].some(hs => hs.score === score && hs.initials === newScore.initials)
  } catch (error) {
    console.error('Error saving high score:', error)
    return false
  }
}

export const isHighScore = (gameName: string, score: number): boolean => {
  const scores = getHighScores(gameName)
  if (scores.length < MAX_HIGH_SCORES) return true
  return score > scores[scores.length - 1].score
}

export const formatScore = (score: number): string => {
  return score.toString().padStart(6, '0')
}

export const clearHighScores = (gameName?: string): void => {
  if (typeof window === 'undefined') return
  
  try {
    if (gameName) {
      const allScores = localStorage.getItem(HIGH_SCORES_KEY)
      if (allScores) {
        const parsed: GameHighScores = JSON.parse(allScores)
        delete parsed[gameName]
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(parsed))
      }
    } else {
      localStorage.removeItem(HIGH_SCORES_KEY)
    }
  } catch (error) {
    console.error('Error clearing high scores:', error)
  }
} 