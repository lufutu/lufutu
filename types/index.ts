export interface DesktopIcon {
  id: string
  icon: string
  label: string
  gridPosition: {
    row: number
    column: number
  }
  selected?: boolean
}

export interface Widget {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  type: string
  data?: any
}

export interface Window {
  id: string
  title: string
  icon?: string
  content: string
  contentComponent?: React.ReactNode
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  originalBounds?: { x: number; y: number; width: number; height: number }
}

export interface DragState {
  isDragging: boolean
  dragType: "window" | "icon" | "widget" | null
  targetId: string | null
  startX: number
  startY: number
  startTargetX: number
  startTargetY: number
}

export interface ContextMenu {
  visible: boolean
  x: number
  y: number
}

export interface Dialog {
  visible: boolean
  type: string
  title: string
  content: string
  inputValue: string
}

export interface Settings {
  youtubeUrl: string
  fontSize: number
  theme: string
  spotifyUrl: string
}

export interface GameState {
  snake: {
    snake: { x: number; y: number }[]
    food: { x: number; y: number }
    direction: string
    score: number
    gameOver: boolean
    isPlaying: boolean
  }
  tetris: {
    board: number[][]
    currentPiece: any
    score: number
    gameOver: boolean
    isPlaying: boolean
  }
  pong: {
    paddle1Y: number
    paddle2Y: number
    ballX: number
    ballY: number
    ballVelX: number
    ballVelY: number
    score1: number
    score2: number
    isPlaying: boolean
  }
  memory: {
    cards: { id: number; value: string; flipped: boolean; matched: boolean }[]
    flippedCards: number[]
    score: number
    moves: number
    gameWon: boolean
  }
}
