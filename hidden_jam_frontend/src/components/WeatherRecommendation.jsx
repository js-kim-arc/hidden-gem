import { useState, useEffect } from 'react'

// 날씨 코드에 따른 아이콘과 설명
const WEATHER_MAP = {
    0: { icon: '☀️', desc: '맑음' },
    1: { icon: '🌤️', desc: '대체로 맑음' },
    2: { icon: '⛅', desc: '부분적 흐림' },
    3: { icon: '☁️', desc: '흐림' },
    45: { icon: '🌫️', desc: '안개' },
    48: { icon: '🌫️', desc: '짙은 안개' },
    51: { icon: '🌧️', desc: '가벼운 이슬비' },
    53: { icon: '🌧️', desc: '이슬비' },
    55: { icon: '🌧️', desc: '강한 이슬비' },
    61: { icon: '🌧️', desc: '약한 비' },
    63: { icon: '🌧️', desc: '비' },
    65: { icon: '🌧️', desc: '강한 비' },
    71: { icon: '🌨️', desc: '약한 눈' },
    73: { icon: '🌨️', desc: '눈' },
    75: { icon: '🌨️', desc: '강한 눈' },
    80: { icon: '🌦️', desc: '소나기' },
    95: { icon: '⛈️', desc: '천둥번개' },
}

// 날씨 조건에 따른 추천 카테고리
const getRecommendations = (weatherCode, temperature) => {
    const recommendations = []

    // 온도 기반 추천
    if (temperature >= 28) {
        recommendations.push('냉면', '빙수', '아이스커피', '회/초밥')
    } else if (temperature >= 20) {
        recommendations.push('한식', '양식', '카페')
    } else if (temperature >= 10) {
        recommendations.push('국밥', '찌개', '라멘')
    } else {
        recommendations.push('뜨끈한 국물', '찜닭', '샤브샤브', '뜨끈한 국밥')
    }

    // 날씨 코드 기반 추천
    if (weatherCode >= 51 && weatherCode <= 67) {
        // 비 오는 날
        recommendations.push('파전', '막걸리', '칼국수')
    } else if (weatherCode >= 71 && weatherCode <= 77) {
        // 눈 오는 날
        recommendations.push('호떡', '붕어빵', '핫초코')
    } else if (weatherCode === 0 || weatherCode === 1) {
        // 맑은 날
        recommendations.push('테라스 맛집', '야외 카페')
    }

    // 중복 제거
    return [...new Set(recommendations)]
}

function WeatherRecommendation({ onCategorySelect, selectedCategory }) {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia/Seoul`
                )
                const data = await response.json()

                setWeather({
                    temperature: Math.round(data.current.temperature_2m),
                    weatherCode: data.current.weather_code,
                })
                setLoading(false)
            } catch (err) {
                setError('날씨 정보를 불러올 수 없습니다')
                setLoading(false)
            }
        }

        // 위치 정보 가져오기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude)
                },
                () => {
                    // 위치 권한 거부 시 서울 기준
                    fetchWeather(37.5665, 126.978)
                }
            )
        } else {
            // Geolocation 미지원 시 서울 기준
            fetchWeather(37.5665, 126.978)
        }
    }, [])

    if (loading) {
        return (
            <section className="weather-section">
                <div className="weather-loading">
                    <span>날씨 정보를 불러오는 중...</span>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="weather-section">
                <p>{error}</p>
            </section>
        )
    }

    const weatherInfo = WEATHER_MAP[weather.weatherCode] || { icon: '🌡️', desc: '알 수 없음' }
    const recommendations = getRecommendations(weather.weatherCode, weather.temperature)

    return (
        <section className="weather-section">
            <div className="weather-header">
                <span className="weather-icon">{weatherInfo.icon}</span>
                <div className="weather-info">
                    <h3>오늘의 날씨: {weatherInfo.desc}, {weather.temperature}°C</h3>
                    <p>이런 날씨에는 이런 음식 어때요?</p>
                </div>
            </div>
            <div className="weather-tags">
                {recommendations.map((rec) => (
                    <button
                        key={rec}
                        className={`weather-tag ${selectedCategory === rec ? 'active' : ''}`}
                        onClick={() => onCategorySelect(selectedCategory === rec ? null : rec)}
                    >
                        {rec}
                    </button>
                ))}
            </div>
        </section>
    )
}

export default WeatherRecommendation
