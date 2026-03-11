function CardSection({
                         places,
                         favorites,
                         onToggleFavorite,
                         showFavoritesOnly,
                         onToggleFilter,
                         selectedCategory,
                         loading,
                         error,
                         onEditPlace,
                         onDeletePlace,
                     }) {
    if (loading) {
        return (
            <section className="card-section">
                <h2>맛집 목록</h2>
                <div className="card-grid">
                    <p className="loading">⏳ 데이터를 불러오는 중입니다...</p>
                </div>
            </section>
        )
    }

    if (error && places.length === 0) {
        return (
            <section className="card-section">
                <h2>맛집 목록</h2>
                <div className="card-grid">
                    <p className="error-message">❌ {error}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="card-section">
            <div className="card-toolbar">
                <h2>맛집 목록</h2>

                <button
                    type="button"
                    className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                    onClick={() => onToggleFilter(!showFavoritesOnly)}
                >
                    {showFavoritesOnly ? '전체 보기' : '즐겨찾기만 보기'}
                </button>
            </div>

            {selectedCategory && (
                <p className="filter-status">
                    현재 필터: <strong>{selectedCategory}</strong>
                </p>
            )}

            {places.length === 0 ? (
                <div className="card-grid">
                    <p className="empty-message">
                        🍽️ 등록된 맛집이 없습니다.
                    </p>
                </div>
            ) : (
                <div className="card-grid">
                    {places.map((place) => {
                        const isFavorite = favorites.includes(place.id)

                        return (
                            <article className="card" key={place.id}>
                                <div className="card-header">
                                    <span className="card-badge">
                                        {place.category || '기타'}
                                    </span>

                                    <button
                                        type="button"
                                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                        onClick={() => onToggleFavorite(place.id)}
                                        aria-label={
                                            isFavorite
                                                ? '즐겨찾기 해제'
                                                : '즐겨찾기 추가'
                                        }
                                    >
                                        {isFavorite ? '❤️' : '🤍'}
                                    </button>
                                </div>

                                <div className="card-content">
                                    <h3 className="card-title">{place.name}</h3>

                                    <p className="card-location">
                                        📍 {place.address}
                                    </p>

                                    <p className="card-call">
                                        📞 {place.call || '번호 미입력'}
                                    </p>

                                    <p className="card-rating">
                                        {'⭐'.repeat(Number(place.rating) || 0)}
                                    </p>

                                    {place.weatherTags?.length > 0 && (
                                        <div className="card-weather-tags">
                                            {place.weatherTags.map((tag) => (
                                                <span
                                                    key={`${place.id}-${tag}`}
                                                    className="card-weather-tag"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="card-actions">
                                    <button
                                        type="button"
                                        className={`card-btn favorite-toggle ${isFavorite ? 'active' : ''}`}
                                        onClick={() => onToggleFavorite(place.id)}
                                    >
                                        {isFavorite
                                            ? '❤️ 즐겨찾기 해제'
                                            : '🤍 즐겨찾기'}
                                    </button>

                                    <button
                                        type="button"
                                        className="card-btn edit-btn"
                                        onClick={() => onEditPlace(place.id)}
                                    >
                                        ✏️ 수정
                                    </button>

                                    <button
                                        type="button"
                                        className="card-btn delete-btn"
                                        onClick={() => onDeletePlace(place.id)}
                                    >
                                        🗑️ 삭제
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default CardSection