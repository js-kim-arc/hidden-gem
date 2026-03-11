import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import WeatherRecommendation from './components/WeatherRecommendation'
import RestaurantForm from './components/RestaurantForm'
import CardSection from './components/CardSection'
import Footer from './components/Footer'

const BASE_URL = 'https://69af829cc63dd197feb95682.mockapi.io/api/places'

async function fetchPlacesApi() {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
        throw new Error(`목록 조회 실패 (${response.status})`)
    }

    const data = await response.json()

    return [...data].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
}

async function fetchPlaceByIdApi(id) {
    const response = await fetch(`${BASE_URL}/${id}`)
    if (!response.ok) {
        throw new Error(`단건 조회 실패 (${response.status})`)
    }
    return response.json()
}

async function createPlaceApi(payload) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error(`등록 실패 (${response.status})`)
    }

    return response.json()
}

async function updatePlaceApi(id, payload) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error(`수정 실패 (${response.status})`)
    }

    return response.json()
}

async function deletePlaceApi(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error(`삭제 실패 (${response.status})`)
    }

    return response.json()
}

function App() {
    const [places, setPlaces] = useState([])
    const [favorites, setFavorites] = useState([])
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const [editingPlace, setEditingPlace] = useState(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadPlaces()

        const savedFavorites = localStorage.getItem('matjip-favorites')
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites))
        }
    }, [])

    const loadPlaces = async () => {
        setLoading(true)
        setError('')

        try {
            const data = await fetchPlacesApi()
            setPlaces(data)
        } catch (err) {
            console.error(err)
            setError(err.message || '목록을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const validatePayload = (formData) => {
        if (!formData.name?.trim()) {
            alert('맛집 이름은 필수입니다.')
            return false
        }

        if (!formData.category?.trim()) {
            alert('카테고리는 필수입니다.')
            return false
        }

        if (!formData.address?.trim()) {
            alert('주소는 필수입니다.')
            return false
        }

        const rating = Number(formData.rating)
        if (!rating || rating < 1 || rating > 5) {
            alert('평점은 1점부터 5점 사이여야 합니다.')
            return false
        }

        return true
    }

    const handleSubmitPlace = async (formData) => {
        const payload = {
            name: formData.name.trim(),
            address: formData.address.trim(),
            call: formData.call?.trim() || '',
            category: formData.category,
            rating: Number(formData.rating),
            weatherTags: formData.weatherTags || [],
        }

        if (!validatePayload(payload)) {
            return false
        }

        setSubmitting(true)
        setError('')
        setMessage('')

        try {
            if (editingPlace?.id) {
                await updatePlaceApi(editingPlace.id, payload)
                setMessage('✅ 맛집 정보가 수정되었습니다.')
            } else {
                await createPlaceApi(payload)
                setMessage('🎉 새 맛집이 등록되었습니다.')
            }

            setEditingPlace(null)
            await loadPlaces()
            return true
        } catch (err) {
            console.error(err)
            setError(err.message || '요청 처리 중 오류가 발생했습니다.')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditPlace = async (id) => {
        try {
            setError('')
            setMessage('')
            const place = await fetchPlaceByIdApi(id)
            setEditingPlace(place)

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } catch (err) {
            console.error(err)
            alert(err.message || '수정할 데이터를 불러오지 못했습니다.')
        }
    }

    const handleDeletePlace = async (id) => {
        const confirmed = window.confirm('정말 삭제하시겠습니까?')
        if (!confirmed) return

        try {
            await deletePlaceApi(id)

            if (editingPlace?.id === id) {
                setEditingPlace(null)
            }

            setMessage('🗑️ 맛집이 삭제되었습니다.')
            await loadPlaces()
        } catch (err) {
            console.error(err)
            alert(err.message || '삭제에 실패했습니다.')
        }
    }

    const handleCancelEdit = () => {
        setEditingPlace(null)
        setMessage('수정이 취소되었습니다.')
    }

    const handleToggleFavorite = (id) => {
        setFavorites((prev) => {
            const newFavorites = prev.includes(id)
                ? prev.filter((fid) => fid !== id)
                : [...prev, id]

            localStorage.setItem(
                'matjip-favorites',
                JSON.stringify(newFavorites)
            )
            return newFavorites
        })
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
    }

    const filteredPlaces = useMemo(() => {
        let result = [...places]

        if (showFavoritesOnly) {
            result = result.filter((place) => favorites.includes(place.id))
        }

        if (selectedCategory) {
            result = result.filter((place) => {
                if (place.category === selectedCategory) return true

                if (Array.isArray(place.weatherTags)) {
                    return place.weatherTags.includes(selectedCategory)
                }

                return false
            })
        }

        return result
    }, [places, favorites, showFavoritesOnly, selectedCategory])

    return (
        <div className="container">
            <Header />

            <WeatherRecommendation
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
            />

            <RestaurantForm
                onSubmit={handleSubmitPlace}
                editingPlace={editingPlace}
                onCancelEdit={handleCancelEdit}
                submitting={submitting}
                message={message}
                error={error}
            />

            <CardSection
                places={filteredPlaces}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFilter={setShowFavoritesOnly}
                selectedCategory={selectedCategory}
                loading={loading}
                error={error}
                onEditPlace={handleEditPlace}
                onDeletePlace={handleDeletePlace}
            />

            <Footer />
        </div>
    )
}

export default App