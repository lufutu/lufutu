import type { Widget, Settings } from "@/types"
import { useState, useEffect, useCallback } from "react"

interface WeatherWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void
  settings: Settings
}

interface WeatherData {
  temperature: number
  weatherCode: number
  humidity: number
  windSpeed: number
  location: string
  loading: boolean
  error?: string
}

const getWeatherIcon = (weatherCode: number): string => {
  // WMO Weather interpretation codes
  if (weatherCode === 0) return "☀️" // Clear sky
  if (weatherCode <= 3) return "⛅" // Partly cloudy
  if (weatherCode <= 48) return "🌫️" // Fog
  if (weatherCode <= 57) return "🌦️" // Drizzle
  if (weatherCode <= 67) return "🌧️" // Rain
  if (weatherCode <= 77) return "❄️" // Snow
  if (weatherCode <= 82) return "🌧️" // Rain showers
  if (weatherCode <= 86) return "❄️" // Snow showers
  if (weatherCode <= 99) return "⛈️" // Thunderstorm
  return "🌡️" // Default
}

const getWeatherDescription = (weatherCode: number): string => {
  if (weatherCode === 0) return "Clear Sky"
  if (weatherCode <= 3) return "Partly Cloudy"
  if (weatherCode <= 48) return "Foggy"
  if (weatherCode <= 57) return "Light Rain"
  if (weatherCode <= 67) return "Rainy"
  if (weatherCode <= 77) return "Snowy"
  if (weatherCode <= 82) return "Rain Showers"
  if (weatherCode <= 86) return "Snow Showers"
  if (weatherCode <= 99) return "Thunderstorm"
  return "Unknown"
}

export function WeatherWidget({ widget, updateWidgetData }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    weatherCode: 0,
    humidity: 0,
    windSpeed: 0,
    location: "Loading...",
    loading: true
  })

  const fetchWeatherData = useCallback(async (lat: number, lon: number, locationName?: string) => {
    try {
      setWeatherData(prev => ({ ...prev, loading: true, error: undefined }))
      
      // Get weather data from Open-Meteo API with location name in response
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto&forecast_days=1`
      )
      
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`)
      }
      
      const data = await weatherResponse.json()
      
      // Create a simple location name based on coordinates if not provided
      const location = locationName || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
      
      const newWeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        location: location,
        loading: false
      }
      
      setWeatherData(newWeatherData)
      updateWidgetData(widget.id, newWeatherData)
    } catch (error) {
      console.error("Weather fetch error:", error)
      setWeatherData(prev => ({
        ...prev,
        loading: false,
        error: "Failed to load weather"
      }))
    }
  }, [widget.id, updateWidgetData])

  const getLocationName = useCallback((lat: number, lon: number): string => {
    // Simple city detection based on coordinates
    const cities = [
      { name: "New York", lat: 40.7128, lon: -74.0060, tolerance: 0.5 },
      { name: "London", lat: 51.5074, lon: -0.1278, tolerance: 0.5 },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503, tolerance: 0.5 },
      { name: "Paris", lat: 48.8566, lon: 2.3522, tolerance: 0.5 },
      { name: "Sydney", lat: -33.8688, lon: 151.2093, tolerance: 0.5 },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437, tolerance: 0.5 },
      { name: "Berlin", lat: 52.5200, lon: 13.4050, tolerance: 0.5 },
      { name: "Singapore", lat: 1.3521, lon: 103.8198, tolerance: 0.5 },
      { name: "Dubai", lat: 25.2048, lon: 55.2708, tolerance: 0.5 },
      { name: "Mumbai", lat: 19.0760, lon: 72.8777, tolerance: 0.5 },
      { name: "São Paulo", lat: -23.5505, lon: -46.6333, tolerance: 0.5 },
      { name: "Cairo", lat: 30.0444, lon: 31.2357, tolerance: 0.5 },
      { name: "Moscow", lat: 55.7558, lon: 37.6176, tolerance: 0.5 },
      { name: "Beijing", lat: 39.9042, lon: 116.4074, tolerance: 0.5 },
      { name: "Mexico City", lat: 19.4326, lon: -99.1332, tolerance: 0.5 },
      { name: "Toronto", lat: 43.6532, lon: -79.3832, tolerance: 0.5 },
      { name: "Seoul", lat: 37.5665, lon: 126.9780, tolerance: 0.5 },
      { name: "Bangkok", lat: 13.7563, lon: 100.5018, tolerance: 0.5 },
      { name: "Istanbul", lat: 41.0082, lon: 28.9784, tolerance: 0.5 },
      { name: "Buenos Aires", lat: -34.6118, lon: -58.3960, tolerance: 0.5 },
      { name: "Hanoi", lat: 21.0285, lon: 105.8542, tolerance: 0.5 },
      { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297, tolerance: 0.5 }
    ]
    
    for (const city of cities) {
      if (Math.abs(lat - city.lat) < city.tolerance && Math.abs(lon - city.lon) < city.tolerance) {
        return city.name
      }
    }
    
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
  }, [])

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const locationName = getLocationName(latitude, longitude)
            fetchWeatherData(latitude, longitude, locationName)
          },
          () => {
            // Default to New York if geolocation fails
            fetchWeatherData(40.7128, -74.0060, "New York")
          }
        )
      } else {
        // Default location if geolocation not supported
        fetchWeatherData(40.7128, -74.0060, "New York")
      }
    }
    getCurrentLocation()
    const interval = setInterval(() => {
      getCurrentLocation()
    }, 600000)
    return () => clearInterval(interval)
  }, [fetchWeatherData, getLocationName, widget.id, updateWidgetData])

  return (
    <div className="widget-content weather-widget-content retro-weather">
      <div className="widget-title-bar retro-title">
        <span className="widget-title retro-title-text">
          🌡️ WEATHER.EXE
        </span>
        <span className="retro-blink">●</span>
      </div>
      
      <div className="retro-weather-main">
        {weatherData.loading ? (
          <div className="retro-loading">
            <div className="retro-loading-text">
              <div className="pixel-spinner">▓▒░</div>
              <div className="loading-message">CONNECTING...</div>
            </div>
          </div>
        ) : weatherData.error ? (
          <div className="retro-error">
            <div className="error-icon">⚠️</div>
            <div className="error-text">ERROR 404</div>
            <div className="error-subtext">Weather not found</div>
          </div>
        ) : (
          <div className="retro-weather-content">
            <div className="weather-display">
              <div className="retro-temp">
                <span className="temp-number">{weatherData.temperature}</span>
                <span className="temp-unit">°C</span>
              </div>
              
              <div className="weather-icon-large">
                {getWeatherIcon(weatherData.weatherCode)}
              </div>
              
              <div className="weather-condition">
                {getWeatherDescription(weatherData.weatherCode)}
              </div>
            </div>
            
            <div className="retro-divider">
              ═══════════════
            </div>
            
            <div className="weather-details-grid">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-label">LOC:</span>
                <span className="detail-value">{weatherData.location}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-label">HUM:</span>
                <span className="detail-value">{weatherData.humidity}%</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-label">WND:</span>
                <span className="detail-value">{weatherData.windSpeed} km/h</span>
              </div>
            </div>
            
            <div className="retro-footer">
              <span className="pixel-decoration">▚▚▚▚▚▚▚▚▚▚▚▚▚</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

WeatherWidget.displayName = "WeatherWidget"
