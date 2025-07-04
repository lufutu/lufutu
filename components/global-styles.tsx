"use client"

import type { Settings } from "@/types"

interface GlobalStylesProps {
  settings: Settings
}

export function GlobalStyles({ settings }: GlobalStylesProps) {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        font-family: 'Press Start 2P', monospace;
        font-size: ${settings.fontSize}px;
        line-height: 1.4;
        overflow: hidden;
      }
      
      .retro-desktop {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
        background: transparent; /* Let video background show through */
        /* Subtle texture overlay on top of video */
      }
      
      .retro-desktop::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          repeating-linear-gradient(90deg, 
            transparent 0px, 
            transparent 3px, 
            rgba(255,255,255,0.005) 3px, 
            rgba(255,255,255,0.005) 4px),
          repeating-linear-gradient(0deg, 
            transparent 0px, 
            transparent 3px, 
            rgba(255,255,255,0.005) 3px, 
            rgba(255,255,255,0.005) 4px);
        background-size: 4px 4px, 4px 4px;
        pointer-events: none;
        z-index: 3;
      }
      
      /* Reduce texture on mobile for performance */
      @media (max-width: 768px) {
        .retro-desktop::before {
          background: none;
        }
      }

      @keyframes gradientShift {
        0%, 100% { filter: hue-rotate(0deg) saturate(1); }
        25% { filter: hue-rotate(10deg) saturate(1.1); }
        50% { filter: hue-rotate(-5deg) saturate(0.9); }
        75% { filter: hue-rotate(15deg) saturate(1.05); }
      }
      
      .video-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: 1;
        background: #000;
      }
      
      .fallback-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(135deg, 
            rgba(139, 92, 246, 0.4) 0%, 
            rgba(168, 85, 247, 0.3) 15%, 
            rgba(236, 72, 153, 0.4) 35%, 
            rgba(139, 92, 246, 0.3) 50%, 
            rgba(168, 85, 247, 0.4) 65%, 
            rgba(236, 72, 153, 0.3) 85%, 
            rgba(139, 92, 246, 0.4) 100%);
        animation: gradientShift 20s ease-in-out infinite;
        z-index: 1;
      }
      
      .video-background iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100%;
        min-height: 100%;
        width: calc(100vw + 20px);
        height: calc(100vh + 20px);
        border: none;
        pointer-events: none;
        z-index: 1;
        object-fit: cover;
      }
      
      /* Mobile optimizations */
      @media (max-width: 768px) {
        .video-background iframe {
          width: calc(100vw + 40px);
          height: calc(100vh + 40px);
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
      
      /* Ultra-wide screen optimizations */
      @media (min-aspect-ratio: 21/9) {
        .video-background iframe {
          height: calc(100vh + 50px);
          width: auto;
          min-width: calc(100vw + 50px);
        }
      }
      
      /* Portrait mobile optimizations */
      @media (max-width: 768px) and (orientation: portrait) {
        .video-background iframe {
          width: auto;
          height: calc(100vh + 60px);
          min-width: calc(100vw + 60px);
          transform: translate(-50%, -50%) scale(1.15);
        }
      }

      .video-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: 
          radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 60%),
          linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
        pointer-events: none;
        z-index: 2;
        backdrop-filter: blur(0.5px);
      }
      
      /* Reduce overlay intensity on mobile for better performance */
      @media (max-width: 768px) {
        .video-overlay {
          background: 
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 70%),
            radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 70%),
            linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
          backdrop-filter: none;
        }
      }
      
      /* Video Control Buttons */
      .video-controls {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 300;
      }
      
      .video-control-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: linear-gradient(145deg, #e6e6e6 0%, #cccccc 100%);
        border: 2px outset #d4d4d4;
        border-radius: 2px;
        cursor: pointer;
        user-select: none;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(6, settings.fontSize - 2)}px;
        color: #333333;
        text-shadow: 1px 1px 0px #ffffff;
        box-shadow: 
          2px 2px 4px rgba(0,0,0,0.3),
          inset 1px 1px 0px rgba(255,255,255,0.8);
        transition: all 0.1s ease;
        min-width: 40px;
      }
      
      .video-control-btn:hover {
        background: linear-gradient(145deg, #f0f0f0 0%, #d6d6d6 100%);
        box-shadow: 
          3px 3px 6px rgba(0,0,0,0.4),
          inset 1px 1px 0px rgba(255,255,255,0.9);
        transform: translateY(-1px);
      }
      
      .video-control-btn:active {
        background: linear-gradient(145deg, #cccccc 0%, #b3b3b3 100%);
        border: 2px inset #d4d4d4;
        box-shadow: 
          1px 1px 2px rgba(0,0,0,0.4),
          inset -1px -1px 0px rgba(255,255,255,0.5);
        transform: translateY(1px);
      }
      
      .control-icon {
        font-size: ${Math.max(8, settings.fontSize)}px;
        display: inline-block;
        width: 12px;
        text-align: center;
      }
      
      .control-label {
        font-size: ${Math.max(5, settings.fontSize - 3)}px;
        letter-spacing: 0.5px;
      }

      /* Volume Control Styles */
      .volume-control {
        display: flex !important;
        align-items: center;
        gap: 8px;
        padding: 6px 10px !important;
        min-width: 140px !important;
      }

      .volume-mute-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
      }

      .volume-mute-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .volume-slider-container {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
      }

      .volume-slider {
        flex: 1;
        height: 4px;
        background: #999999;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
      }

      .volume-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: #333333;
        border: 1px solid #ffffff;
        border-radius: 2px;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      .volume-slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: #333333;
        border: 1px solid #ffffff;
        border-radius: 2px;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      .volume-slider:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .volume-slider:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
      }

      .volume-slider:disabled::-moz-range-thumb {
        cursor: not-allowed;
      }

      .volume-label {
        font-size: ${Math.max(4, settings.fontSize - 4)}px;
        min-width: 25px;
        text-align: right;
        letter-spacing: 0.5px;
      }

      .loading-indicator {
        opacity: 0.7;
      }

      .loading-indicator .control-icon {
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Mobile responsive video controls */
      @media (max-width: 768px) {
        .video-controls {
          bottom: 15px;
          right: 15px;
          gap: 6px;
        }
        
        .video-control-btn {
          padding: 6px 10px;
          font-size: ${Math.max(5, settings.fontSize - 3)}px;
          min-width: 70px;
        }
        
        .control-icon {
          font-size: ${Math.max(7, settings.fontSize - 1)}px;
          width: 10px;
        }
        
        .control-label {
          font-size: ${Math.max(4, settings.fontSize - 4)}px;
        }

        .volume-control {
          min-width: 120px !important;
          padding: 4px 8px !important;
          gap: 6px;
        }

        .volume-slider {
          min-width: 50px;
        }

        .volume-label {
          font-size: ${Math.max(3, settings.fontSize - 5)}px;
          min-width: 20px;
        }
      }
      
      /* Tablet responsive video controls */
      @media (min-width: 769px) and (max-width: 1024px) {
        .video-control-btn {
          padding: 7px 11px;
          font-size: ${Math.max(5, settings.fontSize - 2)}px;
          min-width: 75px;
        }
        
        .control-icon {
          font-size: ${Math.max(7, settings.fontSize - 1)}px;
        }

        .volume-control {
          min-width: 130px !important;
          padding: 5px 9px !important;
        }

        .volume-slider {
          min-width: 55px;
        }

        .volume-label {
          font-size: ${Math.max(3, settings.fontSize - 4)}px;
        }
      }
      
      .desktop-icon {
        position: absolute;
        width: 80px;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        padding: 4px;
        border-radius: 2px;
        transition: all 0.1s ease;
        z-index: 100; /* Ensure icons are above video */
      }
      
      .desktop-icon.selected {
        background: rgba(0, 0, 255, 0.4);
        border: 1px dotted #ffffff;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(2px);
      }
      
      .desktop-icon:hover:not(.selected) {
        background: rgba(255, 255, 255, 0.15);
        transform: scale(1.05);
        backdrop-filter: blur(1px);
      }
      
      .desktop-icon .icon {
        font-size: ${Math.max(20, settings.fontSize * 2.5)}px;
        margin-bottom: 4px;
        filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.9));
      }
      
      .desktop-icon .label {
        font-size: ${settings.fontSize}px;
        text-align: center;
        color: #ffffff;
        text-shadow: 2px 2px 6px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7);
        line-height: 1.2;
        word-wrap: break-word;
        max-width: 80px;
      }
      
      /* Mobile responsive desktop icons */
      @media (max-width: 768px) {
        .desktop-icon {
          width: 56px;
          height: 72px;
          padding: 2px;
        }
        
        .desktop-icon .icon {
          font-size: ${Math.max(18, settings.fontSize * 2)}px;
        }
        
        .desktop-icon .label {
          font-size: ${Math.max(8, settings.fontSize - 1)}px;
          max-width: 52px;
        }
      }
      
      /* Tablet responsive desktop icons */
      @media (min-width: 769px) and (max-width: 1024px) {
        .desktop-icon {
          width: 60px;
          height: 76px;
        }
        
        .desktop-icon .icon {
          font-size: ${Math.max(19, settings.fontSize * 2.2)}px;
        }
      }

      .widget {
        position: absolute;
        background: linear-gradient(145deg, #e6e6e6 0%, #cccccc 100%);
        border: 2px outset #d4d4d4;
        box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
        cursor: move;
        user-select: none;
        border-radius: 2px;
        overflow: hidden;
        z-index: 200; /* Ensure widgets are above video and icons */
      }

      .widget:hover {
        box-shadow: 6px 6px 12px rgba(0,0,0,0.4);
      }

      .widget-content {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .widget-title-bar {
        background: 
          linear-gradient(90deg, #4A148C 0%, #7B1FA2 50%, #4A148C 100%),
          radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        color: #FFD700;
        padding: 8px 12px;
        font-size: ${Math.max(8, settings.fontSize)}px;
        border-bottom: 3px solid #FFD700;
        text-shadow: 
          2px 2px 0px #000000,
          1px 1px 0px #4A148C;
        font-weight: bold;
        letter-spacing: 1px;
        box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.3);
      }

      .hit-counter-widget-content .counter-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 8px;
        background: linear-gradient(145deg, #2d3748 0%, #1a202c 100%);
      }

      .counter-display {
        font-size: ${Math.max(12, settings.fontSize + 6)}px;
        color: #00ff41;
        background: #000000;
        padding: 4px 8px;
        border: 2px inset #333333;
        margin-bottom: 4px;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 8px #00ff41;
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      .counter-label {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        color: #a0aec0;
        text-align: center;
        margin-bottom: 2px;
      }

      .counter-decoration {
        font-size: ${settings.fontSize}px;
        color: #ffd700;
        text-shadow: 0 0 4px #ffd700;
      }

      /* Retro Weather Widget Styles */
      .retro-weather {
        background: 
          linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%),
          repeating-linear-gradient(90deg, 
            transparent 0px, 
            transparent 2px, 
            rgba(0, 255, 0, 0.03) 2px, 
            rgba(0, 255, 0, 0.03) 4px);
        border: 3px solid #00ff00;
        box-shadow: 
          0 0 20px rgba(0, 255, 0, 0.4),
          inset 0 0 20px rgba(0, 255, 0, 0.1);
        font-family: 'Courier New', monospace;
        overflow: hidden;
        position: relative;
      }

      .retro-weather::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(0deg,
            transparent 0px,
            transparent 1px,
            rgba(0, 255, 0, 0.05) 1px,
            rgba(0, 255, 0, 0.05) 2px);
        pointer-events: none;
        animation: scanlines 2s linear infinite;
      }

      @keyframes scanlines {
        0% { transform: translateY(0px); }
        100% { transform: translateY(2px); }
      }

      .retro-title {
        background: 
          linear-gradient(90deg, #4A148C 0%, #7B1FA2 50%, #4A148C 100%),
          radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        color: #FFD700;
        text-shadow: 
          2px 2px 0px #000000,
          1px 1px 0px #4A148C;
        border-bottom: 3px solid #FFD700;
        font-weight: bold;
        letter-spacing: 1px;
        box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.3);
        position: relative;
      }

      .retro-title-text {
        font-weight: bold;
        letter-spacing: 1px;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
      }

      .retro-blink {
        color: #ff0000;
        animation: blink 1s infinite;
        text-shadow: 0 0 4px #ff0000;
      }

      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      .retro-weather-main {
        flex: 1;
        padding: 12px;
        background: 
          radial-gradient(circle at 30% 30%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, #000000 25%, transparent 25%),
          linear-gradient(-45deg, #000000 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #000000 75%),
          linear-gradient(-45deg, transparent 75%, #000000 75%);
        background-size: 20px 20px, 4px 4px, 4px 4px, 4px 4px, 4px 4px;
        color: #00ff00;
        text-align: center;
        position: relative;
      }

      .retro-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #00ff00;
      }

      .pixel-spinner {
        font-size: ${Math.max(14, settings.fontSize + 6)}px;
        color: #00ff00;
        text-shadow: 0 0 8px #00ff00;
        animation: pixelSpin 1.5s linear infinite;
        margin-bottom: 8px;
        font-family: 'Courier New', monospace;
        letter-spacing: 2px;
      }

      @keyframes pixelSpin {
        0% { content: "▓▒░"; }
        33% { content: "░▓▒"; }
        66% { content: "▒░▓"; }
        100% { content: "▓▒░"; }
      }

      .loading-message {
        font-size: ${Math.max(6, settings.fontSize - 2)}px;
        color: #00ff00;
        opacity: 0.8;
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.4; }
      }

      .retro-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #ff0000;
        text-align: center;
      }

      .error-icon {
        font-size: ${Math.max(20, settings.fontSize * 2)}px;
        margin-bottom: 8px;
        animation: errorBlink 1s ease-in-out infinite;
      }

      @keyframes errorBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      .error-text {
        font-size: ${Math.max(8, settings.fontSize)}px;
        font-weight: bold;
        margin-bottom: 4px;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 8px #ff0000;
      }

      .error-subtext {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        opacity: 0.8;
        font-family: 'Courier New', monospace;
      }

      .retro-weather-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* Beautiful Pixel Art Habit Tracker Styles */
      .habit-tracker-content {
        background: 
          linear-gradient(135deg, #8B4513 0%, #D2691E  20%, #CD853F  40%, #DEB887  100%),
          radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.3) 0%, transparent 50%);
        color: #FFFFFF;
        height: 100%;
        display: flex;
        flex-direction: column;
        font-size: ${Math.max(8, settings.fontSize)}px;
        font-family: 'Courier New', 'Monaco', monospace;
        border: 4px solid #5D4037;
        box-shadow: 
          inset 0 0 0 2px #FFD700,
          inset 0 0 0 4px #8B4513,
          0 0 20px rgba(139, 69, 19, 0.6);
        position: relative;
      }

      .habit-tracker-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(0deg,
            transparent 0px,
            transparent 2px,
            rgba(255, 215, 0, 0.1) 2px,
            rgba(255, 215, 0, 0.1) 4px);
        pointer-events: none;
      }

      .habit-tracker-content .widget-title-bar {
        background: 
          linear-gradient(90deg, #4A148C 0%, #7B1FA2 50%, #4A148C 100%),
          radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        color: #FFD700;
        padding: 8px 12px;
        font-size: ${Math.max(8, settings.fontSize)}px;
        border-bottom: 3px solid #FFD700;
        text-shadow: 
          2px 2px 0px #000000,
          1px 1px 0px #4A148C;
        font-weight: bold;
        letter-spacing: 1px;
        box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.3);
      }

      .habit-tracker-main {
        flex: 1;
        overflow-y: auto;
        background: linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%);
        border: 1px inset #d4d4d4;
        margin: 2px;
      }

      .habit-tracker-main::-webkit-scrollbar {
        width: 16px;
      }

      .habit-tracker-main::-webkit-scrollbar-track {
        background: #c0c0c0;
        border: 1px inset #d4d4d4;
      }

      .habit-tracker-main::-webkit-scrollbar-thumb {
        background: linear-gradient(145deg, #e0e0e0 0%, #c0c0c0 100%);
        border: 1px outset #d4d4d4;
      }

      .habit-tracker-main::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(145deg, #f0f0f0 0%, #d0d0d0 100%);
      }

      .habit-tracker-main::-webkit-scrollbar-button {
        background: linear-gradient(145deg, #e0e0e0 0%, #c0c0c0 100%);
        border: 1px outset #d4d4d4;
        height: 16px;
      }

      /* Retro Input Styles */
      .habit-tracker-content input {
        background: #ffffff !important;
        border: 2px inset #d4d4d4 !important;
        color: #000000 !important;
        padding: 4px 6px !important;
      }

      .habit-tracker-content input::placeholder {
        color: #808080 !important;
        opacity: 1 !important;
      }

      .habit-tracker-content input:focus {
        border: 2px inset #d4d4d4 !important;
        outline: 1px dotted #000000 !important;
        outline-offset: -3px !important;
      }

      /* Beautiful Pixel Art Button Styles */
      .habit-tracker-content .btn-complete {
        background: 
          linear-gradient(135deg, #FF6F00 0%, #FF8F00 30%, #FFA000 70%, #FFB300 100%),
          radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%) !important;
        border: 3px solid #E65100 !important;
        color: #FFFFFF !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        font-weight: bold !important;
        text-shadow: 
          2px 2px 0px #000000,
          1px 1px 0px #E65100 !important;
        transition: all 0.2s ease !important;
        box-shadow: 
          inset 0 0 0 1px #FFCC02,
          0 4px 8px rgba(230, 81, 0, 0.4),
          0 0 15px rgba(255, 143, 0, 0.3) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .habit-tracker-content .btn-complete::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: 
          repeating-linear-gradient(45deg,
            transparent 0px,
            transparent 2px,
            rgba(255, 255, 255, 0.15) 2px,
            rgba(255, 255, 255, 0.15) 4px) !important;
        pointer-events: none !important;
      }

      .habit-tracker-content .btn-complete:hover {
        background: 
          linear-gradient(135deg, #FF8F00 0%, #FFA000 30%, #FFB300 70%, #FFC107 100%),
          radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 60%) !important;
        box-shadow: 
          inset 0 0 0 1px #FFD54F,
          0 6px 12px rgba(230, 81, 0, 0.5),
          0 0 20px rgba(255, 143, 0, 0.4) !important;
        transform: translateY(-2px) !important;
      }

      .habit-tracker-content .btn-complete:active {
        transform: translateY(0px) !important;
        box-shadow: 
          inset 0 0 0 1px #FFCC02,
          0 2px 4px rgba(230, 81, 0, 0.4),
          0 0 10px rgba(255, 143, 0, 0.3) !important;
      }

      .habit-tracker-content .btn-complete.completed {
        background: 
          linear-gradient(135deg, #00BCD4 0%, #26C6DA 30%, #4DD0E1 70%, #80DEEA 100%),
          radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%) !important;
        border: 3px solid #006064 !important;
        color: #FFFFFF !important;
        box-shadow: 
          inset 0 0 0 1px #B2EBF2,
          0 4px 8px rgba(0, 96, 100, 0.4),
          0 0 15px rgba(38, 198, 218, 0.4) !important;
      }

      .habit-tracker-content .btn-complete.completed:hover {
        background: 
          linear-gradient(135deg, #26C6DA 0%, #4DD0E1 30%, #80DEEA 70%, #B2EBF2 100%),
          radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 60%) !important;
        box-shadow: 
          inset 0 0 0 1px #E0F7FA,
          0 6px 12px rgba(0, 96, 100, 0.5),
          0 0 20px rgba(38, 198, 218, 0.5) !important;
      }

      /* Beautiful Pixel Art Habit Cards */
      .habit-tracker-content .habit-card {
        background: 
          linear-gradient(135deg, #2E7D32 0%, #4CAF50 30%, #66BB6A 70%, #81C784 100%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%) !important;
        border: 3px solid #1B5E20 !important;
        color: #FFFFFF !important;
        transition: all 0.2s ease !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        box-shadow: 
          inset 0 0 0 1px #A5D6A7,
          0 4px 8px rgba(27, 94, 32, 0.4),
          0 0 15px rgba(76, 175, 80, 0.3) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .habit-tracker-content .habit-card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: 
          repeating-linear-gradient(45deg,
            transparent 0px,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px) !important;
        pointer-events: none !important;
      }

      .habit-tracker-content .habit-card:hover {
        background: 
          linear-gradient(135deg, #388E3C 0%, #66BB6A 30%, #81C784 70%, #A5D6A7 100%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%) !important;
        box-shadow: 
          inset 0 0 0 1px #C8E6C9,
          0 6px 12px rgba(27, 94, 32, 0.5),
          0 0 20px rgba(76, 175, 80, 0.4) !important;
        transform: translateY(-2px) !important;
      }

      .habit-tracker-content .habit-card.completed {
        background: 
          linear-gradient(135deg, #7B1FA2 0%, #9C27B0 30%, #BA68C8 70%, #CE93D8 100%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%) !important;
        border: 3px solid #4A148C !important;
        color: #FFFFFF !important;
        box-shadow: 
          inset 0 0 0 1px #E1BEE7,
          0 4px 8px rgba(74, 20, 140, 0.4),
          0 0 20px rgba(156, 39, 176, 0.5) !important;
      }

      /* Beautiful Pixel Art Text Styles */
      .habit-tracker-content h3 {
        color: #FFFFFF !important;
        font-weight: bold !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        text-shadow: 
          2px 2px 0px #000000,
          1px 1px 0px rgba(0, 0, 0, 0.5) !important;
        letter-spacing: 1px !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .habit-tracker-content .cue-text {
        color: #FFE082 !important;
        font-style: italic !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        text-shadow: 
          1px 1px 0px #000000,
          0 0 10px rgba(255, 224, 130, 0.5) !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .habit-tracker-content .stats-text {
        color: #B39DDB !important;
        font-weight: bold !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        text-shadow: 
          1px 1px 0px #000000,
          0 0 8px rgba(179, 157, 219, 0.5) !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .habit-tracker-content .progress-bar {
        background: 
          linear-gradient(90deg, #424242 0%, #616161 50%, #424242 100%) !important;
        border: 2px solid #000000 !important;
        overflow: hidden !important;
        box-shadow: 
          inset 0 0 5px rgba(0, 0, 0, 0.5),
          0 0 10px rgba(255, 215, 0, 0.3) !important;
        position: relative !important;
      }

      .habit-tracker-content .progress-fill {
        background: 
          linear-gradient(90deg, #FFD700 0%, #FFA000 50%, #FF8F00 100%) !important;
        transition: width 0.4s ease !important;
        box-shadow: 
          inset 0 0 5px rgba(255, 255, 255, 0.3),
          0 0 15px rgba(255, 215, 0, 0.6) !important;
        position: relative !important;
      }

      .habit-tracker-content .progress-fill::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(255, 255, 255, 0.6) 50%, 
          transparent 100%) !important;
        animation: shine 2s infinite !important;
      }

      @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      /* Beautiful Pixel Art Main Container */
      .habit-tracker-content .habit-tracker-main {
        position: relative !important;
        z-index: 1 !important;
        scrollbar-width: thin !important;
        scrollbar-color: #FFD700 #8B4513 !important;
      }

      .habit-tracker-content .habit-tracker-main::-webkit-scrollbar {
        width: 16px !important;
      }

      .habit-tracker-content .habit-tracker-main::-webkit-scrollbar-track {
        background: 
          linear-gradient(90deg, #5D4037 0%, #8B4513 50%, #5D4037 100%) !important;
        border: 2px solid #FFD700 !important;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.5) !important;
      }

      .habit-tracker-content .habit-tracker-main::-webkit-scrollbar-thumb {
        background: 
          linear-gradient(180deg, #FFD700 0%, #FFA000 50%, #FF8F00 100%) !important;
        border: 2px solid #5D4037 !important;
        border-radius: 0 !important;
        box-shadow: 
          inset 0 0 5px rgba(255, 255, 255, 0.3),
          0 0 10px rgba(255, 215, 0, 0.5) !important;
      }

      .habit-tracker-content .habit-tracker-main::-webkit-scrollbar-button {
        background: 
          linear-gradient(180deg, #FFD700 0%, #FFA000 100%) !important;
        border: 2px solid #5D4037 !important;
        height: 16px !important;
      }

      /* Beautiful Pixel Art Input Styles */
      .habit-tracker-content input {
        background: 
          linear-gradient(135deg, #37474F 0%, #455A64 50%, #546E7A 100%) !important;
        border: 3px solid #263238 !important;
        color: #FFFFFF !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        box-shadow: 
          inset 0 0 0 1px #78909C,
          0 4px 8px rgba(38, 50, 56, 0.4),
          0 0 15px rgba(55, 71, 79, 0.3) !important;
      }

      .habit-tracker-content input::placeholder {
        color: #B0BEC5 !important;
      }

      .habit-tracker-content input:focus {
        border-color: #FFD700 !important;
        box-shadow: 
          inset 0 0 0 1px #FFF59D,
          0 4px 8px rgba(38, 50, 56, 0.4),
          0 0 20px rgba(255, 215, 0, 0.5) !important;
        outline: none !important;
      }

      /* Beautiful Pixel Art Empty State */
      .habit-tracker-content .text-center {
        color: #B39DDB !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        text-shadow: 
          1px 1px 0px #000000,
          0 0 8px rgba(179, 157, 219, 0.5) !important;
      }

      /* Beautiful Pixel Art Progress Summary */
      .habit-tracker-content .mt-3.p-2 {
        background: 
          linear-gradient(135deg, #424242 0%, #616161 30%, #757575 70%, #9E9E9E 100%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%) !important;
        border: 3px solid #212121 !important;
        color: #FFFFFF !important;
        font-family: 'Courier New', 'Monaco', monospace !important;
        box-shadow: 
          inset 0 0 0 1px #BDBDBD,
          0 4px 8px rgba(33, 33, 33, 0.4),
          0 0 15px rgba(66, 66, 66, 0.3) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .habit-tracker-content .mt-3.p-2::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: 
          repeating-linear-gradient(45deg,
            transparent 0px,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px) !important;
        pointer-events: none !important;
      }

      .habit-tracker-content .mt-3.p-2 span {
        position: relative !important;
        z-index: 1 !important;
        text-shadow: 
          1px 1px 0px #000000,
          0 0 8px rgba(255, 255, 255, 0.3) !important;
      }

      .weather-display {
        text-align: center;
        margin-bottom: 8px;
      }

      .retro-temp {
        display: flex;
        justify-content: center;
        align-items: baseline;
        margin-bottom: 6px;
      }

      .temp-number {
        font-size: ${Math.max(18, settings.fontSize * 2.2)}px;
        font-weight: bold;
        color: #00ff00;
        text-shadow: 
          0 0 10px #00ff00,
          0 0 20px #00ff00,
          0 0 30px #00ff00;
        font-family: 'Courier New', monospace;
        letter-spacing: 2px;
      }

      .temp-unit {
        font-size: ${Math.max(10, settings.fontSize + 2)}px;
        color: #00cc00;
        margin-left: 2px;
        font-family: 'Courier New', monospace;
      }

      .weather-icon-large {
        font-size: ${Math.max(20, settings.fontSize * 2.5)}px;
        margin: 6px 0;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-2px); }
      }

      .weather-condition {
        font-size: ${Math.max(7, settings.fontSize - 1)}px;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.9;
        margin-bottom: 8px;
      }

      .retro-divider {
        color: #00aa00;
        font-size: ${Math.max(6, settings.fontSize - 2)}px;
        margin: 6px 0;
        opacity: 0.6;
        text-align: center;
        font-family: 'Courier New', monospace;
      }

      .weather-details-grid {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 6px 0;
      }

      .detail-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 4px;
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.2);
        border-radius: 2px;
        font-family: 'Courier New', monospace;
      }

      .detail-icon {
        font-size: ${Math.max(8, settings.fontSize)}px;
        margin-right: 4px;
      }

      .detail-label {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        color: #00aa00;
        font-weight: bold;
        letter-spacing: 1px;
        flex: 1;
      }

      .detail-value {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        color: #00ff00;
        text-shadow: 0 0 4px #00ff00;
        text-align: right;
        min-width: 40px;
      }

      .retro-footer {
        text-align: center;
        margin-top: 6px;
      }

      .pixel-decoration {
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        color: #00aa00;
        opacity: 0.6;
        font-family: 'Courier New', monospace;
        animation: pixelMove 3s linear infinite;
        letter-spacing: 1px;
      }

      @keyframes pixelMove {
        0% { text-shadow: 0 0 4px #00aa00; }
        50% { text-shadow: 0 0 8px #00ff00; }
        100% { text-shadow: 0 0 4px #00aa00; }
      }

      .spotify-widget-content {
        background: 
          linear-gradient(45deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%),
          repeating-linear-gradient(90deg, 
            transparent 0px, 
            transparent 2px, 
            rgba(0, 255, 100, 0.03) 2px, 
            rgba(0, 255, 100, 0.03) 4px);
        border: 3px solid #00ff41;
        box-shadow: 
          0 0 20px rgba(0, 255, 65, 0.3),
          inset 0 0 20px rgba(0, 255, 65, 0.1),
          0 0 0 1px #003300;
        position: relative;
        overflow: hidden;
      }

      /* Spotify Widget - Keep Original Matrix Theme */
      .widget-spotify{
        border: none;
      }
      .spotify-widget-content .widget-title-bar {
        background: linear-gradient(90deg, #003300 0%, #006600 50%, #003300 100%) !important;
        color: #00ff00 !important;
        text-shadow: 0 0 8px #00ff00 !important;
        border-bottom: 2px solid #00ff00 !important;
        font-weight: normal !important;
        letter-spacing: normal !important;
        box-shadow: none !important;
        padding: 6px 8px !important;
      }

      .spotify-widget-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(0deg,
            transparent 0px,
            transparent 1px,
            rgba(0, 255, 65, 0.08) 1px,
            rgba(0, 255, 65, 0.08) 2px,
            transparent 2px,
            transparent 4px);
        pointer-events: none;
        z-index: 10;
        animation: scanlines 3s linear infinite;
      }

      @keyframes scanlines {
        0% { transform: translateY(0px); }
        100% { transform: translateY(4px); }
      }

      .spotify-widget-content::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: 
          linear-gradient(45deg, 
            #00ff41 0%, #00ff41 25%, 
            #ff0080 25%, #ff0080 50%, 
            #00ffff 50%, #00ffff 75%, 
            #ffff00 75%, #ffff00 100%);
        background-size: 8px 8px;
        z-index: -1;
        animation: pixelBorder 4s linear infinite;
      }

      @keyframes pixelBorder {
        0% { background-position: 0px 0px; }
        100% { background-position: 8px 8px; }
      }

      .spotify-player {
        flex: 1;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: 
          radial-gradient(circle at 30% 70%, rgba(0, 255, 65, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
      }

      .spotify-player iframe {
        border-radius: 8px !important;
        border: 2px solid #00ff41 !important;
        box-shadow: 
          0 0 15px rgba(0, 255, 65, 0.4),
          inset 0 0 10px rgba(0, 0, 0, 0.3) !important;
        filter: 
          contrast(1.1) 
          saturate(1.2) 
          brightness(0.9)
          sepia(0.1);
        transition: all 0.3s ease;
        position: relative;
        z-index: 5;
      }

      .spotify-player iframe:hover {
        filter: 
          contrast(1.2) 
          saturate(1.3) 
          brightness(1.0)
          sepia(0.05);
        box-shadow: 
          0 0 25px rgba(0, 255, 65, 0.6),
          inset 0 0 15px rgba(0, 0, 0, 0.2) !important;
      }

      .spotify-player::before {
        content: '';
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border: 1px dashed #00ff41;
        border-radius: 6px;
        opacity: 0.3;
        z-index: 1;
        animation: dashBorder 2s linear infinite;
      }

      @keyframes dashBorder {
        0% { border-color: #00ff41; opacity: 0.3; }
        50% { border-color: #ff0080; opacity: 0.6; }
        100% { border-color: #00ff41; opacity: 0.3; }
      }

      .spotify-player::after {
        content: '♪ ♫ ♪ ♫';
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: ${Math.max(8, settings.fontSize)}px;
        color: #00ff41;
        opacity: 0.4;
        z-index: 1;
        animation: musicNotes 3s ease-in-out infinite;
        text-shadow: 0 0 8px #00ff41;
      }

      @keyframes musicNotes {
        0%, 100% { opacity: 0.4; transform: translateY(0px); }
        50% { opacity: 0.8; transform: translateY(-2px); }
      }

      .spotify-settings {
        flex: 1;
        padding: 12px;
        background: 
          linear-gradient(135deg, #1a1a2e 0%, #16213e 100%),
          repeating-conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            rgba(0, 255, 65, 0.05) 90deg, 
            transparent 180deg, 
            rgba(255, 0, 128, 0.05) 270deg);
        color: #00ff41;
        border: 1px solid #00ff41;
        position: relative;
      }

      .spotify-settings::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(45deg,
            transparent 0px,
            transparent 10px,
            rgba(0, 255, 65, 0.05) 10px,
            rgba(0, 255, 65, 0.05) 11px);
        pointer-events: none;
      }

      .settings-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        position: relative;
        z-index: 2;
      }

      .input-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #00ff41;
        border-radius: 4px;
        position: relative;
      }

      .input-section::before {
        content: '■ ■ ■';
        position: absolute;
        top: -1px;
        right: 4px;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        color: #00ff41;
        background: #1a1a2e;
        padding: 0 4px;
      }

      .input-label {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        font-weight: bold;
        color: #00ff41;
        text-shadow: 0 0 8px #00ff41;
        font-family: 'Press Start 2P', monospace;
        animation: labelGlow 2s ease-in-out infinite alternate;
      }

      @keyframes labelGlow {
        0% { text-shadow: 0 0 8px #00ff41; }
        100% { text-shadow: 0 0 12px #00ff41, 0 0 16px #00ff41; }
      }

      .url-input {
        width: 100%;
        padding: 6px 8px;
        border: 2px solid #00ff41;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        background: 
          #000000,
          repeating-linear-gradient(90deg,
            transparent 0px,
            transparent 20px,
            rgba(0, 255, 65, 0.1) 20px,
            rgba(0, 255, 65, 0.1) 21px);
        color: #00ff41;
        border-radius: 2px;
        outline: none;
        box-shadow: 
          inset 0 0 10px rgba(0, 0, 0, 0.5),
          0 0 10px rgba(0, 255, 65, 0.3);
        transition: all 0.3s ease;
      }

      .url-input:focus {
        border: 2px solid #ff0080;
        box-shadow: 
          inset 0 0 10px rgba(0, 0, 0, 0.5),
          0 0 15px rgba(255, 0, 128, 0.5);
        text-shadow: 0 0 5px #00ff41;
      }

      .url-input::placeholder {
        color: rgba(0, 255, 65, 0.5);
        font-style: italic;
      }

      .error-message {
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        color: #ff0080;
        margin-top: 4px;
        font-family: 'Press Start 2P', monospace;
        text-shadow: 0 0 8px #ff0080;
        animation: errorPulse 1s ease-in-out infinite;
      }

      @keyframes errorPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .button-group {
        display: flex;
        gap: 8px;
        justify-content: center;
        padding: 8px;
      }

      .save-btn, .cancel-btn {
        padding: 6px 12px;
        border: 2px solid;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        cursor: pointer;
        border-radius: 2px;
        position: relative;
        transition: all 0.2s ease;
        text-shadow: 0 0 4px currentColor;
        box-shadow: 
          0 4px 0 rgba(0, 0, 0, 0.3),
          0 0 10px currentColor;
      }

      .save-btn {
        background: #00ff41;
        border-color: #00ff41;
        color: #000000;
      }

      .save-btn:hover {
        background: #ff0080;
        border-color: #ff0080;
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 
          0 6px 0 rgba(0, 0, 0, 0.3),
          0 0 15px #ff0080;
      }

      .save-btn:active {
        transform: translateY(2px);
        box-shadow: 
          0 2px 0 rgba(0, 0, 0, 0.3),
          0 0 5px currentColor;
      }

      .cancel-btn {
        background: #1a1a2e;
        border-color: #00ff41;
        color: #00ff41;
      }

      .cancel-btn:hover {
        background: #00ff41;
        color: #000000;
        transform: translateY(-2px);
        box-shadow: 
          0 6px 0 rgba(0, 0, 0, 0.3),
          0 0 15px #00ff41;
      }

      .cancel-btn:active {
        transform: translateY(2px);
        box-shadow: 
          0 2px 0 rgba(0, 0, 0, 0.3),
          0 0 5px currentColor;
      }

      .help-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 8px;
        background: rgba(0, 255, 65, 0.1);
        border: 1px dashed #00ff41;
        border-radius: 4px;
        position: relative;
      }

      .help-text::before {
        content: '?';
        position: absolute;
        top: -8px;
        left: 8px;
        width: 16px;
        height: 16px;
        background: #00ff41;
        color: #000000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.max(8, settings.fontSize)}px;
        font-weight: bold;
        font-family: 'Press Start 2P', monospace;
      }

      .help-title {
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        font-weight: bold;
        color: #00ff41;
        font-family: 'Press Start 2P', monospace;
        margin-top: 4px;
      }

      .help-item {
        font-size: ${Math.max(3, settings.fontSize - 4)}px;
        color: rgba(0, 255, 65, 0.8);
        line-height: 1.4;
        font-family: 'Press Start 2P', monospace;
        padding-left: 8px;
        position: relative;
      }

      .help-item::before {
        content: '▶';
        position: absolute;
        left: 0;
        color: #ff0080;
        font-size: ${Math.max(3, settings.fontSize - 4)}px;
      }

      .help-note {
        font-size: ${Math.max(3, settings.fontSize - 4)}px;
        color: #00ffff;
        font-style: italic;
        margin-top: 4px;
        font-family: 'Press Start 2P', monospace;
        text-align: center;
        animation: noteGlow 3s ease-in-out infinite;
      }

      @keyframes noteGlow {
        0%, 100% { text-shadow: 0 0 4px #00ffff; }
        50% { text-shadow: 0 0 8px #00ffff, 0 0 12px #00ffff; }
      }

      .spotify-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #ff0080;
        text-align: center;
        padding: 16px;
        background: 
          radial-gradient(circle at center, rgba(255, 0, 128, 0.1) 0%, transparent 70%),
          repeating-conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            rgba(255, 0, 128, 0.05) 30deg, 
            transparent 60deg);
        position: relative;
      }

      .spotify-error::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(45deg,
            transparent 0px,
            transparent 15px,
            rgba(255, 0, 128, 0.1) 15px,
            rgba(255, 0, 128, 0.1) 16px);
        pointer-events: none;
      }

      .error-icon {
        font-size: ${Math.max(20, settings.fontSize * 2.5)}px;
        margin-bottom: 8px;
        animation: errorIcon 2s ease-in-out infinite;
        text-shadow: 0 0 12px #ff0080;
      }

      @keyframes errorIcon {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        50% { transform: scale(1) rotate(0deg); }
        75% { transform: scale(1.1) rotate(5deg); }
      }

      .error-text {
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        margin-bottom: 6px;
        font-weight: bold;
        font-family: 'Press Start 2P', monospace;
        text-shadow: 0 0 8px #ff0080;
      }

      .error-hint {
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        opacity: 0.8;
        font-style: italic;
        font-family: 'Press Start 2P', monospace;
        color: #00ffff;
        animation: hintBlink 2s ease-in-out infinite;
      }

      @keyframes hintBlink {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.4; }
      }

      .clock-widget-content .clock-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 8px;
        background: linear-gradient(145deg, #2d3748 0%, #1a202c 100%);
        color: #00ffff;
      }

      .digital-time {
        font-size: ${Math.max(10, settings.fontSize + 4)}px;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 8px #00ffff;
        margin-bottom: 4px;
      }

      .digital-date {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        opacity: 0.8;
      }

      .system-widget-content .system-main {
        flex: 1;
        padding: 8px;
        background: linear-gradient(145deg, #2d3748 0%, #1a202c 100%);
        color: white;
      }

      .system-stat {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
      }

      .stat-label {
        width: 30px;
        color: #a0aec0;
      }

      .stat-bar {
        flex: 1;
        height: 8px;
        background: #4a5568;
        border: 1px inset #2d3748;
        margin: 0 4px;
        overflow: hidden;
        border-radius: 2px;
      }

      .stat-fill {
        height: 100%;
        background: linear-gradient(90deg, #48bb78 0%, #38a169 50%, #e53e3e 100%);
        border-radius: 1px;
      }

      .stat-fill.animated {
        transition: width 0.5s ease-out;
      }

      .stat-value {
        width: 25px;
        text-align: right;
        color: #e2e8f0;
      }

      .system-footer {
        margin-top: 4px;
        padding-top: 4px;
        border-top: 1px solid #4a5568;
        text-align: center;
      }

      .system-info {
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        color: #a0aec0;
        opacity: 0.8;
      }

      .notes-widget-content .notes-main {
        flex: 1;
        padding: 4px;
        background: #f7fafc;
      }

      .notes-textarea {
        width: 100%;
        height: 100%;
        border: 1px inset #d4d4d4;
        background: #ffffff;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        padding: 4px;
        resize: none;
        outline: none;
        line-height: 1.4;
      }

      .social-widget-content .social-main {
        flex: 1;
        padding: 6px;
        background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
      }

      .social-profile {
        display: flex;
        align-items: center;
        padding: 4px;
        margin-bottom: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        border-left: 3px solid;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .social-profile:hover {
        background: rgba(255,255,255,0.2);
        transform: translateX(2px);
      }

      .social-icon {
        font-size: ${Math.max(12, settings.fontSize + 4)}px;
        margin-right: 6px;
      }

      .social-info {
        flex: 1;
      }

      .social-name {
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        color: white;
        font-weight: bold;
        margin-bottom: 1px;
      }

      .social-url {
        font-size: ${Math.max(4, settings.fontSize - 3)}px;
        color: rgba(255,255,255,0.8);
      }

      .context-menu {
        position: fixed;
        background: #c0c0c0;
        border: 2px outset #c0c0c0;
        box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 150px;
      }

      .context-menu-item {
        padding: 4px 8px;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        cursor: pointer;
        border-bottom: 1px solid #a0a0a0;
      }

      .context-menu-item:hover {
        background: #0066cc;
        color: white;
      }

      .context-menu-item:last-child {
        border-bottom: none;
      }

      .dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
      }

      .dialog {
        background: #c0c0c0;
        border: 2px outset #c0c0c0;
        box-shadow: 8px 8px 16px rgba(0,0,0,0.4);
        min-width: 300px;
        max-width: 500px;
      }

      .dialog-titlebar {
        background: linear-gradient(90deg, #0066cc 0%, #004499 100%);
        color: white;
        padding: 4px 8px;
        font-size: ${Math.max(7, settings.fontSize)}px;
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
      }

      .dialog-content {
        padding: 16px;
      }

      .dialog-text {
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        margin-bottom: 12px;
        line-height: 1.4;
      }

      .dialog-input {
        width: 100%;
        padding: 4px;
        border: 1px inset #c0c0c0;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        margin-bottom: 12px;
      }

      .dialog-buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .dialog-button {
        padding: 4px 12px;
        border: 2px outset #c0c0c0;
        background: #c0c0c0;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        cursor: pointer;
      }

      .dialog-button:hover {
        background: #d0d0d0;
      }

      .dialog-button:active {
        border: 2px inset #c0c0c0;
      }

      .dialog-button.primary {
        background: #0066cc;
        color: white;
        border-color: #0066cc;
      }

      .dialog-button.primary:hover {
        background: #0077dd;
      }

      /* Game Styles */
      .games-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-top: 16px;
      }

      .game-card {
        background: linear-gradient(145deg, #f0f0f0 0%, #d0d0d0 100%);
        border: 2px outset #e0e0e0;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .game-card:hover {
        background: linear-gradient(145deg, #f8f8f8 0%, #e0e0e0 100%);
        transform: translateY(-2px);
      }

      .game-card:active {
        border: 2px inset #e0e0e0;
      }

      .game-icon {
        font-size: ${Math.max(24, settings.fontSize * 3)}px;
        margin-bottom: 8px;
      }

      .game-title {
        font-size: ${Math.max(8, settings.fontSize)}px;
        font-weight: bold;
        margin-bottom: 4px;
        color: #333;
      }

      .game-desc {
        font-size: ${Math.max(6, settings.fontSize - 2)}px;
        color: #666;
      }

      .game-container {
        padding: 16px;
        text-align: center;
      }

      .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #999;
      }

      .game-header h3 {
        margin: 0;
        font-size: ${Math.max(10, settings.fontSize + 2)}px;
        color: #333;
      }

      .game-score {
        font-size: ${Math.max(8, settings.fontSize)}px;
        color: #666;
      }

      .game-canvas-container {
        margin: 16px 0;
        display: flex;
        justify-content: center;
      }

      .game-canvas-container canvas {
        border: 2px inset #c0c0c0;
        background: #000;
      }

      .game-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .game-btn {
        padding: 6px 16px;
        border: 2px outset #c0c0c0;
        background: #c0c0c0;
        font-family: 'Press Start 2P', monospace;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        cursor: pointer;
        margin: 0 4px;
      }

      .game-btn:hover {
        background: #d0d0d0;
      }

      .game-btn:active {
        border: 2px inset #c0c0c0;
      }

      .game-instructions {
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        color: #666;
        margin-top: 8px;
      }

      .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin: 16px 0;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
      }

      .memory-card {
        width: 60px;
        height: 60px;
        background: linear-gradient(145deg, #e0e0e0 0%, #c0c0c0 100%);
        border: 2px outset #d0d0d0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.max(20, settings.fontSize * 2.5)}px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .memory-card:hover {
        background: linear-gradient(145deg, #f0f0f0 0%, #d0d0d0 100%);
      }

      .memory-card.flipped {
        background: linear-gradient(145deg, #fff 0%, #f0f0f0 100%);
        border: 2px inset #d0d0d0;
      }

      .memory-card.matched {
        background: linear-gradient(145deg, #90ee90 0%, #7dd87d 100%);
        border: 2px inset #7dd87d;
      }
      
      .window {
        position: absolute;
        background: #c0c0c0;
        border: 2px outset #c0c0c0;
        min-width: 300px;
        min-height: 200px;
        box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
        z-index: 1000;
      }
      
      .window.minimized {
        display: none;
      }
      
      .window-titlebar {
        height: 24px;
        background: 
          linear-gradient(90deg, #4A148C 0%, #7B1FA2 50%, #4A148C 100%),
          radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        color: #FFD700;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        cursor: move;
        user-select: none;
        border-bottom: 3px solid #FFD700;
        text-shadow: 
          2px 2px 0px #000000,
          1px 1px 0px #4A148C;
        font-weight: bold;
        letter-spacing: 1px;
        box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.3);
      }
      
      .window-title {
        font-size: ${settings.fontSize}px;
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
      }
      
      .window-controls {
        display: flex;
        gap: 1px;
      }
      
      .window-control {
        width: 16px;
        height: 14px;
        background: #c0c0c0;
        border: 1px outset #c0c0c0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
      }
      
      .window-control:hover {
        background: #d0d0d0;
      }
      
      .window-control:active {
        border: 1px inset #c0c0c0;
      }

      .minimize-icon {
        width: 8px;
        height: 2px;
        background: #000;
        position: absolute;
        bottom: 3px;
      }

      .maximize-icon {
        width: 8px;
        height: 8px;
        border: 1px solid #000;
        position: relative;
      }

      .maximize-icon.restore::before {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        width: 6px;
        height: 6px;
        border: 1px solid #000;
        background: #c0c0c0;
      }
      
      .close-icon {
        width: 8px;
        height: 8px;
        position: relative;
      }

      .close-icon::before,
      .close-icon::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 1px;
        background: #000;
        top: 50%;
        left: 50%;
        transform-origin: center;
      }

      .close-icon::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      .close-icon::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      
      .window-content {
        padding: 12px;
        height: calc(100% - 27px);
        overflow: auto;
        background: #c0c0c0;
      }

      /* Pixel Browser specific styles */
      .window .pixel-browser {
        padding: 0;
        margin: -12px;
        height: calc(100% + 24px);
      }

      /* Retro browser chrome styling */
      .pixel-browser .border-outset {
        border-top: 1px solid #dfdfdf;
        border-left: 1px solid #dfdfdf;
        border-right: 1px solid #808080;
        border-bottom: 1px solid #808080;
      }

      .pixel-browser .border-inset {
        border-top: 1px solid #808080;
        border-left: 1px solid #808080;
        border-right: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
      }

      .pixel-browser .active\\:border-inset:active {
        border-top: 1px solid #808080 !important;
        border-left: 1px solid #808080 !important;
        border-right: 1px solid #dfdfdf !important;
        border-bottom: 1px solid #dfdfdf !important;
      }
      
      .retro-content h2 {
        font-size: ${Math.max(8, settings.fontSize + 2)}px;
        color: #8B5CF6;
        margin: 0 0 10px 0;
        text-decoration: underline;
      }
      
      .retro-content h3 {
        font-size: ${settings.fontSize}px;
        color: #EC4899;
        margin: 8px 0 4px 0;
      }
      
      .retro-content p {
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        line-height: 1.4;
        margin: 6px 0;
        color: #000;
      }
      
      .retro-content ul {
        margin: 4px 0;
        padding-left: 15px;
      }
      
      .retro-content li {
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        margin: 2px 0;
        color: #000;
      }
      
      .stats-box, .job-entry, .blog-post, .skills-section, .contact-info {
        background: #ffffff;
        border: 1px inset #c0c0c0;
        padding: 8px;
        margin: 8px 0;
      }
      
      .company, .date {
        color: #666 !important;
        font-style: italic;
      }
      
      .skills-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 5px;
      }
      
      .skill-tag {
        background: #8B5CF6;
        color: white;
        padding: 2px 4px;
        font-size: ${Math.max(5, settings.fontSize - 2)}px;
        border: 1px outset #8B5CF6;
      }
      
      .taskbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 32px;
        background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%);
        border-top: 2px outset #c0c0c0;
        display: flex;
        align-items: center;
        padding: 0 8px;
        z-index: 9999;
      }
      
      .taskbar-item {
        height: 24px;
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
        border: 1px outset #e2e8f0;
        padding: 0 8px;
        margin-right: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: ${Math.max(6, settings.fontSize - 1)}px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .taskbar-item:hover {
        background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
      }
      
      .taskbar-item.minimized {
        border: 1px inset #e2e8f0;
        background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
      }

      /* ===== RESPONSIVE DESIGN FOR WIDGETS ===== */
      
      /* Mobile Devices (0-768px) */
      @media (max-width: 768px) {
        .widget {
          position: absolute !important;
          z-index: 300 !important;
          transform: scale(0.85);
          transform-origin: top left;
        }
        
        /* Mobile Widget Content Adjustments */
        .widget-title-bar {
          padding: 6px 8px;
          font-size: ${Math.max(6, settings.fontSize - 1)}px !important;
        }
        
        .counter-display {
          font-size: ${Math.max(10, settings.fontSize + 2)}px !important;
          padding: 2px 4px;
        }
        
        .counter-label {
          font-size: ${Math.max(4, settings.fontSize - 3)}px !important;
        }
        
        .social-profile {
          padding: 2px;
          margin-bottom: 2px;
        }
        
        .social-name {
          font-size: ${Math.max(5, settings.fontSize - 2)}px !important;
        }
        
        .social-url {
          font-size: ${Math.max(3, settings.fontSize - 4)}px !important;
        }
        
        .weather-display .retro-temp .temp-number {
          font-size: ${Math.max(16, settings.fontSize + 8)}px !important;
        }
        
        .detail-item {
          font-size: ${Math.max(4, settings.fontSize - 3)}px !important;
        }
        
        .spotify-player iframe {
          height: 120px !important;
        }
        
        .notes-textarea {
          font-size: ${Math.max(5, settings.fontSize - 2)}px !important;
          padding: 2px;
        }
      }
      
      /* Tablet Devices (769px-1024px) */
      @media (min-width: 769px) and (max-width: 1024px) {
        .widget {
          transform: scale(0.9);
          transform-origin: top left;
        }
        
        /* Tablet Widget Positioning - Two columns */
        .widget-hit-counter {
          right: 200px !important;
          top: 80px !important;
          left: auto !important;
          width: 130px !important;
          height: 95px !important;
        }
        
        .widget-social {
          right: 20px !important;
          top: 80px !important;
          left: auto !important;
          width: 150px !important;
          height: 130px !important;
        }
        
        .widget-weather {
          right: 200px !important;
          top: 190px !important;
          left: auto !important;
          width: 170px !important;
          height: 135px !important;
        }
        
        .widget-system-monitor {
          right: 20px !important;
          top: 220px !important;
          left: auto !important;
          width: 150px !important;
          height: 115px !important;
        }
        
        .widget-clock {
          right: 200px !important;
          top: 340px !important;
          left: auto !important;
          width: 130px !important;
          height: 75px !important;
        }
        
        .widget-spotify {
          right: 50px !important;
          top: 350px !important;
          left: auto !important;
          width: 300px !important;
          height: 180px !important;
        }
        
        .widget-notes {
          right: 20px !important;
          top: 540px !important;
          left: auto !important;
          width: 190px !important;
          height: 150px !important;
        }
        
        .widget-habit-tracker {
          right: 200px !important;
          top: 430px !important;
          left: auto !important;
          width: 260px !important;
          height: 300px !important;
        }
        
        /* Tablet content adjustments */
        .widget-title-bar {
          font-size: ${Math.max(7, settings.fontSize)}px !important;
          padding: 7px 10px;
        }
        
        .desktop-icon {
          width: 55px !important;
          height: 70px !important;
        }
        
                 .desktop-icon .icon {
           font-size: ${Math.max(18, settings.fontSize * 2)}px !important;
         }
         
         /* Tablet Window Responsive */
         .window {
           max-width: calc(100vw - 40px) !important;
           max-height: calc(100vh - 120px) !important;
           width: min(600px, calc(100vw - 40px)) !important;
           height: auto !important;
           left: 20px !important;
           top: 80px !important;
           position: fixed !important;
         }
         
         .window-content {
           padding: 12px !important;
           font-size: ${Math.max(7, settings.fontSize)}px !important;
         }
         
         .retro-content h2 {
           font-size: ${Math.max(9, settings.fontSize + 2)}px !important;
         }
         
         .retro-content p, .retro-content li {
           font-size: ${Math.max(6, settings.fontSize - 1)}px !important;
         }
       }
      
      /* Large Desktop (1025px+) */
      @media (min-width: 1025px) and (max-width: 1366px) {
        .widget {
          transform: scale(0.95);
          transform-origin: top left;
        }
        
        /* Adjust positioning for smaller desktop screens */
        .widget-hit-counter {
          right: 380px !important;
          top: 80px !important;
          left: auto !important;
        }
        
        .widget-social {
          right: 200px !important;
          top: 80px !important;
          left: auto !important;
        }
        
        .widget-weather {
          right: 380px !important;
          top: 200px !important;
          left: auto !important;
        }
        
        .widget-system-monitor {
          right: 200px !important;
          top: 240px !important;
          left: auto !important;
        }
        
        .widget-clock {
          right: 380px !important;
          top: 360px !important;
          left: auto !important;
        }
        
        .widget-spotify {
          right: 220px !important;
          top: 380px !important;
          left: auto !important;
        }
        
        .widget-notes {
          right: 200px !important;
          top: 380px !important;
          left: auto !important;
        }
        
        .widget-habit-tracker {
          right: 380px !important;
          top: 450px !important;
          left: auto !important;
        }
      }
      
      /* Extra Wide Screens (1920px+) */
      @media (min-width: 1920px) {
        .widget {
          transform: scale(1.1);
          transform-origin: top left;
        }
        
        /* Keep widgets on the right but with more spacing */
        .widget-hit-counter {
          right: 500px !important;
        }
        
        .widget-social {
          right: 320px !important;
        }
        
        .widget-weather {
          right: 500px !important;
        }
        
        .widget-system-monitor {
          right: 320px !important;
        }
        
        .widget-spotify {
          right: 340px !important;
        }
        
        .widget-notes {
          right: 320px !important;
        }
        
        .widget-clock {
          right: 500px !important;
        }
        
        .widget-habit-tracker {
          right: 500px !important;
        }
      }
    `}</style>
  )
}
