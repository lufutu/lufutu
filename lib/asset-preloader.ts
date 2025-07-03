export interface PreloadProgress {
  total: number
  loaded: number
  percentage: number
  currentAsset?: string
  errors: string[]
}

export type PreloadProgressCallback = (progress: PreloadProgress) => void

/**
 * Preload image assets with progress tracking
 */
export const preloadImages = async (
  urls: string[], 
  onProgress?: PreloadProgressCallback
): Promise<PreloadProgress> => {
  const progress: PreloadProgress = {
    total: urls.length,
    loaded: 0,
    percentage: 0,
    errors: []
  }

  const promises = urls.map(async (url) => {
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          progress.loaded++
          progress.percentage = (progress.loaded / progress.total) * 100
          progress.currentAsset = url
          onProgress?.(progress)
          resolve()
        }
        img.onerror = () => {
          progress.loaded++
          progress.errors.push(`Failed to load: ${url}`)
          progress.percentage = (progress.loaded / progress.total) * 100
          onProgress?.(progress)
          reject(new Error(`Failed to load image: ${url}`))
        }
        img.src = url
      })
    } catch (error) {
      // Continue loading other images even if one fails
      console.warn(`Failed to preload image: ${url}`, error)
    }
  })

  await Promise.allSettled(promises)
  return progress
}

/**
 * Preload audio assets with progress tracking
 */
export const preloadAudio = async (
  urls: string[], 
  onProgress?: PreloadProgressCallback
): Promise<PreloadProgress> => {
  const progress: PreloadProgress = {
    total: urls.length,
    loaded: 0,
    percentage: 0,
    errors: []
  }

  const promises = urls.map(async (url) => {
    try {
      await new Promise<void>((resolve, reject) => {
        const audio = new Audio()
        audio.oncanplaythrough = () => {
          progress.loaded++
          progress.percentage = (progress.loaded / progress.total) * 100
          progress.currentAsset = url
          onProgress?.(progress)
          resolve()
        }
        audio.onerror = () => {
          progress.loaded++
          progress.errors.push(`Failed to load: ${url}`)
          progress.percentage = (progress.loaded / progress.total) * 100
          onProgress?.(progress)
          reject(new Error(`Failed to load audio: ${url}`))
        }
        audio.src = url
      })
    } catch (error) {
      console.warn(`Failed to preload audio: ${url}`, error)
    }
  })

  await Promise.allSettled(promises)
  return progress
}

/**
 * Preload external scripts
 */
export const preloadScript = async (
  src: string, 
  onProgress?: PreloadProgressCallback
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    
    script.onload = () => {
      onProgress?.({
        total: 1,
        loaded: 1,
        percentage: 100,
        currentAsset: src,
        errors: []
      })
      resolve()
    }
    
    script.onerror = () => {
      const error = `Failed to load script: ${src}`
      onProgress?.({
        total: 1,
        loaded: 1,
        percentage: 100,
        currentAsset: src,
        errors: [error]
      })
      reject(new Error(error))
    }
    
    document.head.appendChild(script)
  })
}

/**
 * Preload CSS/font files
 */
export const preloadFont = async (
  href: string, 
  onProgress?: PreloadProgressCallback
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Check if link is already loaded
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    
    link.onload = () => {
      onProgress?.({
        total: 1,
        loaded: 1,
        percentage: 100,
        currentAsset: href,
        errors: []
      })
      resolve()
    }
    
    link.onerror = () => {
      const error = `Failed to load font: ${href}`
      onProgress?.({
        total: 1,
        loaded: 1,
        percentage: 100,
        currentAsset: href,
        errors: [error]
      })
      reject(new Error(error))
    }
    
    document.head.appendChild(link)
  })
}

/**
 * Combined asset preloader with overall progress tracking
 */
export const preloadAllAssets = async (
  assets: {
    images?: string[]
    audio?: string[]
    scripts?: string[]
    fonts?: string[]
  },
  onProgress?: PreloadProgressCallback
): Promise<PreloadProgress> => {
  const totalAssets = 
    (assets.images?.length || 0) + 
    (assets.audio?.length || 0) + 
    (assets.scripts?.length || 0) + 
    (assets.fonts?.length || 0)

  const overallProgress: PreloadProgress = {
    total: totalAssets,
    loaded: 0,
    percentage: 0,
    errors: []
  }

  const updateOverallProgress = (localProgress: PreloadProgress) => {
    overallProgress.loaded++
    overallProgress.percentage = (overallProgress.loaded / overallProgress.total) * 100
    overallProgress.currentAsset = localProgress.currentAsset
    overallProgress.errors.push(...localProgress.errors)
    onProgress?.(overallProgress)
  }

  // Load all asset types in parallel
  const promises: Promise<unknown>[] = []

  if (assets.images?.length) {
    promises.push(preloadImages(assets.images, updateOverallProgress))
  }

  if (assets.audio?.length) {
    promises.push(preloadAudio(assets.audio, updateOverallProgress))
  }

  if (assets.scripts?.length) {
    promises.push(
      Promise.all(
        assets.scripts.map(script => 
          preloadScript(script, updateOverallProgress).catch(console.warn)
        )
      )
    )
  }

  if (assets.fonts?.length) {
    promises.push(
      Promise.all(
        assets.fonts.map(font => 
          preloadFont(font, updateOverallProgress).catch(console.warn)
        )
      )
    )
  }

  await Promise.allSettled(promises)
  return overallProgress
} 