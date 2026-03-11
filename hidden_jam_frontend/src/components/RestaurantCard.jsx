function RestaurantCard({ place }) {
    const { name, category, address, call, rating } = place

    const renderStars = (score) => '⭐'.repeat(Number(score))

    return (
        <div className="card">
            <span className="card-badge">{category}</span>

            <div className="card-content">
                <h3 className="card-title">{name}</h3>
                <p className="card-location">📍 {address}</p>
                {call && <p className="card-description">📞 {call}</p>}
                <p className="card-rating">
                    {renderStars(rating)} ({rating}점)
                </p>
            </div>
        </div>
    )
}

export default RestaurantCard