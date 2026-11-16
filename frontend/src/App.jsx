import { useState, useEffect, useMemo } from "react";
import CoinDetails from "./components/CoinDetails";
import Auth from "./components/Auth";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [coins, setCoins] = useState([]);

  const [error, setError] = useState("");

  const [sortOrder, setSortOrder] = useState("high");

  const [selectedCoin, setSelectedCoin] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  const [watchlist, setWatchlist] = useState([]);

  const toggleWatchlist = async (coinId) => {
    try {
      const token = localStorage.getItem("token");

      const isAdded = watchlist.includes(coinId);

      const response = await fetch(
        isAdded
          ? `http://localhost:5000/api/watchlist/${coinId}`
          : "http://localhost:5000/api/watchlist/add",
        {
          method: isAdded ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(isAdded
            ? {}
            : {
                body: JSON.stringify({ coinId }),
              }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Watchlist update failed");
      }

      setWatchlist((prev) =>
        isAdded ? prev.filter((id) => id !== coinId) : [...prev, coinId],
      );
    } catch (error) {
      console.error("Watchlist update error:", error);
    }
  };

  // useEffect(() => {
  //   localStorage.setItem("watchlist", JSON.stringify(watchlist));
  // }, [watchlist]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch crypto data");
        }

        const data = await response.json();
        setCoins(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCoins();
  }, []);

  const watchlistCoins = coins.filter((coin) => {
    return watchlist.includes(coin.id);
  });

  // hide the loading message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      if (sortOrder === "high") {
        return b.current_price - a.current_price;
      }

      return a.current_price - b.current_price;
    });
  }, [filteredCoins, sortOrder]);

  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setWatchlist([]);
    setSelectedCoin(null);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/watchlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch watchlist");
        }

        const coinIds = data.watchlist.map((item) => item.coinId);

        setWatchlist(coinIds);
      } catch (error) {
        console.error("Watchlist fetch error:", error);
      }
    };

    fetchWatchlist();
  }, [isAuthenticated]);

  return (
    <>
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <div className="app">
          <div>
            <h1>Crypto Tracker</h1>
            <p>Track prices, explore the market, and build your watchlist.</p>

            <button onClick={handleLogout}>Logout</button>

            <div>
              <input
                type="search"
                placeholder="Search Cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>Search</button>
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="high">Price: High to Low</option>
              <option value="low">Price: Low to High</option>
            </select>
            <section>
              {error && <p>{error}</p>}
              {isLoading && <p>Loading Cryptocurrencies</p>}
              {!isLoading && (
                <table>
                  <thead>
                    <tr>
                      <th
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          fontSize: "1.2rem",
                          borderBottom: "none",
                        }}
                      >
                        Cryptocurrency Market Overview
                      </th>
                    </tr>
                    <tr>
                      <th>Coin</th>
                      <th>Symbol</th>
                      <th>Price</th>
                      <th>Market Cap</th>
                      <th>24h Change</th>
                      <th>Watchlist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCoins.map((coin) => (
                      <tr
                        key={coin.id}
                        onClick={() => setSelectedCoin(coin)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{coin.name}</td>
                        <td>{coin.symbol}</td>
                        <td>
                          {coin.current_price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                        <td>
                          ${coin.market_cap?.toLocaleString("en-US") ?? "N/A"}
                        </td>
                        <td
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? "positive"
                              : "negative"
                          }
                        >
                          {coin.price_change_percentage_24h?.toFixed(2) ??
                            "N/A"}
                        </td>

                        <td>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleWatchlist(coin.id);
                            }}
                          >
                            {watchlist.includes(coin.id) ? "⭐ Added" : "☆ Add"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="watchlist-section">
              <h2>My Watchlist ⭐</h2>

              {watchlistCoins.length === 0 ? (
                <p>No cryptocurrencies added yet.</p>
              ) : (
                watchlistCoins.map((coin) => (
                  <div className="watchlist-item" key={coin.id}>
                    <img src={coin.image} alt={coin.name} width="30" />

                    <span>{coin.name}</span>

                    <span>${coin.current_price.toLocaleString("en-US")}</span>

                    <button onClick={() => toggleWatchlist(coin.id)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </section>

            {selectedCoin && (
              <CoinDetails
                coin={selectedCoin}
                onClose={() => setSelectedCoin(null)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
