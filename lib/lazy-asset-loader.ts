import { preloadImages, preloadAudio } from './asset-preloader'
import { LAZY_LOAD_ASSETS } from './app-assets'

// Cache to track what's already been loaded
const loadedAssets = new Set<string>()
const loadingPromises = new Map<string, Promise<void>>()

/**
 * Lazy load game icons when games window is opened
 */
export const loadGameAssets = async (): Promise<void> => {
  const cacheKey = 'game-assets'
  
  if (loadedAssets.has(cacheKey)) {
    return Promise.resolve()
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!
  }
  
  const promise = preloadImages(LAZY_LOAD_ASSETS.GAME_ICONS).then(() => {
    loadedAssets.add(cacheKey)
    loadingPromises.delete(cacheKey)
  })
  
  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Lazy load widget icons when specific widgets are opened
 */
export const loadWidgetAssets = async (): Promise<void> => {
  const cacheKey = 'widget-assets'
  
  if (loadedAssets.has(cacheKey)) {
    return Promise.resolve()
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!
  }
  
  const promise = preloadImages(LAZY_LOAD_ASSETS.WIDGET_ICONS).then(() => {
    loadedAssets.add(cacheKey)
    loadingPromises.delete(cacheKey)
  })
  
  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Lazy load audio assets when media controls are first used
 */
export const loadAudioAssets = async (): Promise<void> => {
  const cacheKey = 'audio-assets'
  
  if (loadedAssets.has(cacheKey)) {
    return Promise.resolve()
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!
  }
  
  const promise = preloadAudio(LAZY_LOAD_ASSETS.AUDIO_FILES).then(() => {
    loadedAssets.add(cacheKey)
    loadingPromises.delete(cacheKey)
  })
  
  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Lazy load system icons when needed
 */
export const loadSystemAssets = async (): Promise<void> => {
  const cacheKey = 'system-assets'
  
  if (loadedAssets.has(cacheKey)) {
    return Promise.resolve()
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!
  }
  
  const promise = preloadImages(LAZY_LOAD_ASSETS.SYSTEM_ICONS).then(() => {
    loadedAssets.add(cacheKey)
    loadingPromises.delete(cacheKey)
  })
  
  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Lazy load placeholder images when content fails to load
 */
export const loadPlaceholderAssets = async (): Promise<void> => {
  const cacheKey = 'placeholder-assets'
  
  if (loadedAssets.has(cacheKey)) {
    return Promise.resolve()
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!
  }
  
  const promise = preloadImages(LAZY_LOAD_ASSETS.PLACEHOLDER_IMAGES).then(() => {
    loadedAssets.add(cacheKey)
    loadingPromises.delete(cacheKey)
  })
  
  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Generic lazy loader for any asset group
 */
export const lazyLoadAssets = async (
  assetGroup: string[], 
  cacheKey: string,
  type: 'images' | 'audio' = 'images'
): Promise<void> => {
  if (loadedAssets.has(cacheKey)) {
    return Promise.resolve()
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!
  }
  
  const promise = (type === 'images' ? preloadImages : preloadAudio)(assetGroup).then(() => {
    loadedAssets.add(cacheKey)
    loadingPromises.delete(cacheKey)
  })
  
  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Check if an asset group has been loaded
 */
export const isAssetGroupLoaded = (cacheKey: string): boolean => {
  return loadedAssets.has(cacheKey)
}

/**
 * Preemptively load commonly used assets in the background
 */
export const preemptivelyLoadCommonAssets = async (): Promise<void> => {
  // Load these in the background after the main app is ready
  setTimeout(async () => {
    try {
      await loadWidgetAssets() // Widgets are commonly used
      console.log('Preemptively loaded widget assets')
    } catch (error) {
      console.warn('Failed to preemptively load widget assets:', error)
    }
  }, 2000)
  
  setTimeout(async () => {
    try {
      await loadSystemAssets() // System icons may be needed
      console.log('Preemptively loaded system assets')
    } catch (error) {
      console.warn('Failed to preemptively load system assets:', error)
    }
  }, 4000)
} 