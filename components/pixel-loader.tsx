"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { DitheringPattern } from './dithering-pattern'
import { preloadAllAssets, type PreloadProgress } from '@/lib/asset-preloader'
import { APP_ASSETS, ASSET_CATEGORIES, getTotalAssetCount } from '@/lib/app-assets'

interface LoadingStep {
  name: string
  progress: number
  status: 'pending' | 'loading' | 'complete' | 'error'
  message?: string
}

interface PixelLoaderProps {
  onComplete: () => void
}

const LOADING_STEPS = [
  { name: 'SYSTEM_BOOT', message: 'Initializing retro system...' },
  { name: 'FONTS', message: 'Loading system fonts...' },
  { name: 'DESKTOP_ICONS', message: 'Loading desktop icons...' },
  { name: 'UI_ICONS', message: 'Loading interface elements...' },
  { name: 'BACKGROUNDS', message: 'Loading desktop background...' },
  { name: 'SCRIPTS', message: 'Loading system modules...' },
  { name: 'STARTUP', message: 'Starting desktop environment...' }
]

export function PixelLoader({ onComplete }: PixelLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<LoadingStep[]>(
    LOADING_STEPS.map(step => ({ 
      ...step, 
      progress: 0, 
      status: 'pending' 
    }))
  )
  const [bootText, setBootText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)
  const [loadingDots, setLoadingDots] = useState('')

  // Animated loading dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  // Cursor blinking animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 800)

    return () => clearInterval(cursorInterval)
  }, [])

  // Preload all assets using the new utility
  const preloadAssets = useCallback(async () => {
    const totalAssets = getTotalAssetCount()

    const updateProgress = (stepIndex: number, progress: number, status: 'loading' | 'complete' | 'error') => {
      setSteps(prev => prev.map((step, i) => 
        i === stepIndex ? { ...step, progress, status } : step
      ))
      
      const stepProgress = (stepIndex * 100 + progress) / LOADING_STEPS.length
      setOverallProgress(stepProgress)
    }

    try {
      // Step 1: System Boot
      setCurrentStep(0)
      updateProgress(0, 0, 'loading')
      await new Promise(resolve => setTimeout(resolve, 800))
      updateProgress(0, 100, 'complete')

      // Step 2: Load Fonts
      setCurrentStep(1)
      updateProgress(1, 0, 'loading')
      
      await preloadAllAssets({
        fonts: ASSET_CATEGORIES.FONTS
      }, (progress: PreloadProgress) => {
        updateProgress(1, progress.percentage, 'loading')
      })
      updateProgress(1, 100, 'complete')

      // Step 3: Load Desktop Icons
      setCurrentStep(2)
      updateProgress(2, 0, 'loading')
      
      await preloadAllAssets({
        images: ASSET_CATEGORIES.DESKTOP_ICONS
      }, (progress: PreloadProgress) => {
        updateProgress(2, progress.percentage, 'loading')
      })
      updateProgress(2, 100, 'complete')

      // Step 4: Load UI Icons
      setCurrentStep(3)
      updateProgress(3, 0, 'loading')
      
      await preloadAllAssets({
        images: ASSET_CATEGORIES.UI_ICONS
      }, (progress: PreloadProgress) => {
        updateProgress(3, progress.percentage, 'loading')
      })
      updateProgress(3, 100, 'complete')

      // Step 5: Load Backgrounds
      setCurrentStep(4)
      updateProgress(4, 0, 'loading')
      
      await preloadAllAssets({
        images: ASSET_CATEGORIES.BACKGROUNDS
      }, (progress: PreloadProgress) => {
        updateProgress(4, progress.percentage, 'loading')
      })
      updateProgress(4, 100, 'complete')

      // Step 6: Load Scripts
      setCurrentStep(5)
      updateProgress(5, 0, 'loading')
      
      await preloadAllAssets({
        scripts: ASSET_CATEGORIES.SCRIPTS
      }, (progress: PreloadProgress) => {
        updateProgress(5, progress.percentage, 'loading')
      })
      updateProgress(5, 100, 'complete')

      // Step 7: System Startup
      setCurrentStep(6)
      updateProgress(6, 0, 'loading')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateProgress(6, 100, 'complete')

      // Final completion
      setOverallProgress(100)
      await new Promise(resolve => setTimeout(resolve, 500))
      onComplete()

    } catch (error) {
      console.error('Loading error:', error)
      // Continue to app even if some assets fail
      onComplete()
    }
  }, [onComplete])

      // Boot sequence text animation
    useEffect(() => {
      const bootSequence = [
        'Lufutu Retro System v1.0',
        'Copyright © 2025 Lufutu Digital',
        '',
        'System Check:',
        '  Memory........640K OK',
        '  Graphics......VGA Compatible',
        '  Sound.........SoundBlaster16 OK',
        '  Pixel Art.....Enabled',
        '',
        'Initializing desktop environment...',
        'Loading retro components...',
        'Ready to start!',
      ]

      // Function to type out text with proper line breaks
      const typeText = async () => {
        let fullText = ''
        
        for (let i = 0; i < bootSequence.length; i++) {
          const line = bootSequence[i]
          
          // Type each character in the line
          for (let j = 0; j < line.length; j++) {
            fullText += line[j]
            setBootText(fullText)
            await new Promise(resolve => setTimeout(resolve, 25))
          }
          
          // Add line break after each line
          fullText += '\n'
          setBootText(fullText)
          
          // Slightly longer pause at the end of each line
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }

            // Start typing animation and store cleanup function
      let isTyping = true
      typeText().catch(console.error).finally(() => {
        isTyping = false
      })

      // Cleanup function to prevent state updates if component unmounts
      return () => {
        isTyping = false
      }
  }, [])

  // Start loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadAssets()
    }, 2000) // Wait for boot text to finish

    return () => clearTimeout(timer)
  }, [preloadAssets])

  const currentStepData = steps[currentStep]

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: 'url(/assets/backgrounds/coffee_in_rain_by.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'MS Sans Serif', sans-serif"
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Subtle dithering pattern */}
      <DitheringPattern pattern="fine" opacity={0.1} />
      
      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Logo section */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/assets/icons/Controller_Blue.png" 
              alt="Lufutu Logo" 
              className="w-16 h-16 mr-4"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
            />
            <div className="text-left">
              <h1 
                className="text-2xl font-bold text-white mb-1"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontFamily: "'MS Sans Serif', sans-serif"
                }}
              >
                Lufutu
              </h1>
              <p 
                className="text-sm text-gray-200"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  fontFamily: "'MS Sans Serif', sans-serif"
                }}
              >
                Retro Digital Experience
              </p>
            </div>
          </div>
        </div>

        {/* Loading progress section */}
        <div className="w-80 mx-auto">
          {/* Current loading step */}
          {currentStepData && (
            <div className="mb-4">
              <p 
                className="text-white text-sm mb-2"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  fontFamily: "'MS Sans Serif', sans-serif"
                }}
              >
                {currentStepData.message}{loadingDots}
              </p>
            </div>
          )}

          {/* Progress bar container */}
          <div 
            className="w-full p-3 mb-4"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
              border: '2px inset #d4d4d4',
              borderRadius: '2px'
            }}
          >
            {/* Progress percentage */}
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-xs"
                style={{
                  color: '#000000',
                  fontFamily: "'MS Sans Serif', sans-serif"
                }}
              >
                Loading Progress
              </span>
              <span 
                className="text-xs font-bold"
                style={{
                  color: '#000000',
                  fontFamily: "'MS Sans Serif', sans-serif"
                }}
              >
                {Math.round(overallProgress)}%
              </span>
            </div>

            {/* Progress bar */}
            <div 
              className="w-full h-4 relative"
              style={{
                border: '1px inset #c0c0c0',
                background: '#ffffff'
              }}
            >
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${overallProgress}%`,
                  background: 'linear-gradient(145deg, #90EE90 0%, #32CD32 100%)',
                  border: overallProgress > 0 ? '1px outset #90EE90' : 'none'
                }}
              />
              
              {/* Progress bar segments for retro feel */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-gray-300"
                    style={{ borderWidth: '0.5px' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* System status */}
          {bootText && (
            <div 
              className="p-3 text-left"
              style={{
                background: 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
                border: '2px inset #d4d4d4',
                borderRadius: '2px'
              }}
            >
              <pre 
                className="text-xs leading-relaxed whitespace-pre-wrap"
                style={{
                  fontFamily: 'Courier New, monospace',
                  color: '#000000',
                  maxHeight: '80px',
                  overflow: 'hidden'
                }}
              >
                {bootText.split('\n').slice(-4).join('\n')}
                {showCursor && <span className="bg-black text-white">█</span>}
              </pre>
            </div>
          )}
        </div>

        {/* Version info */}
        <div className="mt-8">
          <p 
            className="text-xs text-gray-300"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontFamily: "'MS Sans Serif', sans-serif"
            }}
          >
            Version 1.0 • Starting Windows 98 Style Experience
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .relative {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  )
} 