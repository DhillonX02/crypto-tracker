function CoinDetails({ coin, onClose }) {
  return (
    <div className="coin-details">
      <button className="back-button" onClick={onClose}>
        ← Back to Market
      </button>

      <div className="coin-details-header">
        <img src={coin.image} alt={coin.name} />

        <div>
          <h2>{coin.name}</h2>
          <p>{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="coin-price">
        <h1>
          {coin.current_price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h1>

        <p
          className={
            coin.price_change_percentage_24h >= 0
              ? "positive"
              : "negative"
          }
        >
          {coin.price_change_percentage_24h?.toFixed(2) ?? "N/A"}% (24h)
        </p>
      </div>

      <div className="coin-stats">
        <div className="stat-card">
          <h4>Market Cap</h4>
          <p>${coin.market_cap?.toLocaleString("en-US") ?? "N/A"}</p>
        </div>

        <div className="stat-card">
          <h4>24h High</h4>
          <p>${coin.high_24h?.toLocaleString("en-US") ?? "N/A"}</p>
        </div>

        <div className="stat-card">
          <h4>24h Low</h4>
          <p>${coin.low_24h?.toLocaleString("en-US") ?? "N/A"}</p>
        </div>

        <div className="stat-card">
          <h4>Total Volume</h4>
          <p>${coin.total_volume?.toLocaleString("en-US") ?? "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export default CoinDetails;