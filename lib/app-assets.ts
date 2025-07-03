// Desktop and UI Icons
export const DESKTOP_ICONS = [
  '/assets/icons/home.png',
  '/assets/icons/work.png',
  '/assets/icons/blog.png',
  '/assets/icons/service.png',
  '/assets/icons/art.png',
  '/assets/icons/about.png',
  '/assets/icons/contact.png',
  '/assets/icons/game.png',
]

// Game Icons
export const GAME_ICONS = [
  '/assets/icons/Controller_Blue.png',
  '/assets/icons/Circle_Blue.png',
  '/assets/icons/Letter D Yellow_Blue.png',
  '/assets/icons/Letter C_Blue.png',
  '/assets/icons/Letter A_Blue.png',
  '/assets/icons/Letter M Yellow_Blue.png',
  '/assets/icons/Letter G Black_Blue.png',
  '/assets/icons/Letter S Yellow_Blue.png',
  '/assets/icons/Letter B Yellow_Blue.png',
]

// Widget Icons
export const WIDGET_ICONS = [
  '/assets/icons/Document_Blue.png',
  '/assets/icons/Letter T Yellow_Blue.png',
  '/assets/icons/Letter X_Blue.png',
  '/assets/icons/Plus_Blue.png',
  '/assets/icons/Clock_Blue.png',
  '/assets/icons/Weather_Blue.png',
  '/assets/icons/Writing_Blue.png',
  '/assets/icons/Calculator_Blue.png',
  '/assets/icons/Apple_Blue.png',
  '/assets/icons/Chip_Blue.png',
  '/assets/icons/Spotify.png',
]

// System Icons
export const SYSTEM_ICONS = [
  '/assets/icons/Arrow Down_Blue.png',
  '/assets/icons/Arrow Left_Blue.png',
  '/assets/icons/Arrow Right_Blue.png',
  '/assets/icons/Arrow Up_Blue.png',
  '/assets/icons/Calendar_Blue.png',
  '/assets/icons/File_Blue.png',
  '/assets/icons/Hammer_Blue.png',
  '/assets/icons/Phone_Blue.png',
  '/assets/icons/Power_Blue.png',
  '/assets/icons/User_Blue.png',
  '/assets/icons/Location_Blue.png',
  '/assets/icons/Note_Blue.png',
]

// Placeholder Images
export const PLACEHOLDER_IMAGES = [
  '/placeholder.svg',
  '/window.svg',
  '/file.svg',
  '/placeholder-logo.png',
  '/placeholder-user.jpg',
  '/placeholder.jpg',
]

// Background Images
export const BACKGROUND_IMAGES = [
  '/assets/backgrounds/coffee_in_rain_by.webp',
  '/cityscape-bg.png',
]

// Audio Files
export const AUDIO_FILES = [
  '/assets/sounds/lofi-girl.mp3',
]

// External Scripts
export const EXTERNAL_SCRIPTS = [
  'https://www.youtube.com/iframe_api',
]

// External Fonts
export const EXTERNAL_FONTS = [
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
]

// Combined asset collections
export const ALL_IMAGES = [
  ...DESKTOP_ICONS,
  ...GAME_ICONS,
  ...WIDGET_ICONS,
  ...SYSTEM_ICONS,
  ...PLACEHOLDER_IMAGES,
  ...BACKGROUND_IMAGES,
]

export const APP_ASSETS = {
  images: ALL_IMAGES,
  audio: AUDIO_FILES,
  scripts: EXTERNAL_SCRIPTS,
  fonts: EXTERNAL_FONTS,
}

// Essential assets that need to be preloaded
export const ESSENTIAL_ASSETS = {
  // Critical for initial app rendering
  FONTS: EXTERNAL_FONTS,
  DESKTOP_ICONS: DESKTOP_ICONS, // Visible immediately on desktop
  BASIC_UI_ICONS: [
    '/assets/icons/Circle_Blue.png', // Used in taskbar and widgets
    '/assets/icons/Controller_Blue.png', // Logo and main icon
    '/assets/icons/Letter X_Blue.png', // Close buttons
    '/assets/icons/Plus_Blue.png', // Add buttons
  ],
  BACKGROUNDS: ['/assets/backgrounds/coffee_in_rain_by.webp'], // Default background
}

// Non-essential assets that can be loaded on-demand
export const LAZY_LOAD_ASSETS = {
  GAME_ICONS: GAME_ICONS, // Only needed when games are opened
  WIDGET_ICONS: WIDGET_ICONS.filter(icon => 
    !ESSENTIAL_ASSETS.BASIC_UI_ICONS.includes(icon)
  ), // Only needed when specific widgets are used
  SYSTEM_ICONS: SYSTEM_ICONS, // Only needed in specific contexts
  AUDIO_FILES: AUDIO_FILES, // Only needed when media is played
  PLACEHOLDER_IMAGES: PLACEHOLDER_IMAGES, // Only needed when content fails
  EXTRA_BACKGROUNDS: ['/cityscape-bg.png'], // Alternative backgrounds
}

// Asset categories for loading steps (only essential ones)
export const ASSET_CATEGORIES = {
  SYSTEM_BOOT: [],
  FONTS: ESSENTIAL_ASSETS.FONTS,
  DESKTOP_ICONS: ESSENTIAL_ASSETS.DESKTOP_ICONS,
  UI_ICONS: ESSENTIAL_ASSETS.BASIC_UI_ICONS,
  BACKGROUNDS: ESSENTIAL_ASSETS.BACKGROUNDS,
  SCRIPTS: EXTERNAL_SCRIPTS, // YouTube API might be needed
  STARTUP: [],
}

// Get total essential asset count (what we actually preload)
export const getTotalAssetCount = (): number => {
  return (
    ESSENTIAL_ASSETS.FONTS.length +
    ESSENTIAL_ASSETS.DESKTOP_ICONS.length +
    ESSENTIAL_ASSETS.BASIC_UI_ICONS.length +
    ESSENTIAL_ASSETS.BACKGROUNDS.length +
    EXTERNAL_SCRIPTS.length
  )
}

// Get assets for specific category
export const getAssetsByCategory = (category: keyof typeof ASSET_CATEGORIES): string[] => {
  return ASSET_CATEGORIES[category] || []
} 