"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { DitheringPattern } from './dithering-pattern'
import { preloadAllAssets, type PreloadProgress } from '@/lib/asset-preloader'
import { ASSET_CATEGORIES } from '@/lib/app-assets'
import Image from "next/image"

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
      typeText().catch(console.error)

      // Cleanup function to prevent state updates if component unmounts
      return () => {
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
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Subtle dithering pattern */}
      <DitheringPattern pattern="fine" opacity={0.1} />
      
      {/* Main loading content */}
      <div className="relative z-10 text-center max-w-[90vw] md:max-w-[600px] p-4">
        {/* Logo section */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/assets/icons/lufutu.png"
              alt="Lufutu Logo"
              width={48}
              height={48}
              className="w-12 h-12 md:w-16 md:h-16 mr-2 md:mr-4"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
            />
            <div className="text-left">
              <h1 
                className="text-lg md:text-2xl font-bold text-white mb-1"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                Lufutu OS
              </h1>
              <p 
                className="text-xs md:text-sm text-white/90"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                Version 1.0 • Starting OS Style Experience
              </p>
            </div>
          </div>

          {/* Boot text terminal */}
          <div 
            className="bg-black/80 border border-white/20 rounded p-3 md:p-4 mb-4 md:mb-6 text-left"
            style={{
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            }}
          >
            <pre 
              className="text-[10px] md:text-xs text-green-400 font-mono whitespace-pre-wrap"
              style={{
                textShadow: '0 0 8px rgba(74, 222, 128, 0.4)',
                lineHeight: '1.5',
              }}
            >
              {bootText}{showCursor ? '_' : ' '}
            </pre>
          </div>

          {/* Loading progress */}
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs md:text-sm">
                {currentStepData?.message || 'Preparing...'}
                {currentStepData?.status === 'loading' && loadingDots}
              </span>
              <span className="text-xs md:text-sm">
                {Math.round(overallProgress)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 md:h-3 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            {/* Current step indicator */}
            <p 
              className="text-[10px] md:text-xs text-white/70"
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
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