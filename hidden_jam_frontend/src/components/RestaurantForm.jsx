import { useEffect, useState } from 'react'

const initialForm = {
    name: '',
    category: '',
    address: '',
    call: '',
    rating: '',
    weatherTags: [],
}

function RestaurantForm({
                            onSubmit,
                            editingPlace,
                            onCancelEdit,
                            submitting,
                            message,
                            error,
                        }) {
    const [formData, setFormData] = useState(initialForm)

    useEffect(() => {
        if (editingPlace) {
            setFormData({
                name: editingPlace.name || '',
                category: editingPlace.category || '',
                address: editingPlace.address || '',
                call: editingPlace.call || '',
                rating: editingPlace.rating || '',
                weatherTags: editingPlace.weatherTags || [],
            })
        } else {
            setFormData(initialForm)
        }
    }, [editingPlace])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await onSubmit(formData)

        if (success) {
            setFormData(initialForm)
        }
    }

    return (
        <section className="form-section">
            <h2>{editingPlace ? '맛집 수정하기' : '맛집 등록하기'}</h2>

            <form className="restaurant-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">맛집 이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="맛집 이름을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">카테고리 선택</option>
                        <option value="한식">한식</option>
                        <option value="중식">중식</option>
                        <option value="일식">일식</option>
                        <option value="양식">양식</option>
                        <option value="카페">카페/디저트</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="address">주소</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="주소를 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="call">전화번호</label>
                    <input
                        type="text"
                        id="call"
                        name="call"
                        value={formData.call}
                        onChange={handleChange}
                        placeholder="예) 02-1234-5678"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rating">평점</label>
                    <select
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                    >
                        <option value="">평점 선택</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                        <option value="4">⭐⭐⭐⭐ (4점)</option>
                        <option value="3">⭐⭐⭐ (3점)</option>
                        <option value="2">⭐⭐ (2점)</option>
                        <option value="1">⭐ (1점)</option>
                    </select>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting
                            ? editingPlace
                                ? '수정 중...'
                                : '등록 중...'
                            : editingPlace
                                ? '수정 완료'
                                : '맛집 등록'}
                    </button>

                    {editingPlace && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancelEdit}
                        >
                            수정 취소
                        </button>
                    )}
                </div>
            </form>

            {message && <p className="form-message success">{message}</p>}
            {error && <p className="form-message error">{error}</p>}
        </section>
    )
}

export default RestaurantForm