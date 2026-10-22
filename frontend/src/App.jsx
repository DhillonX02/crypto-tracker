import { useState, useEffect } from "react";
import bitcoinImg from "./assets/bitcoin.png";
import ethereumImg from "./assets/ethereum.png";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [coins, setCoins] = useState([]);

  const [error,setError] = useState("");

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

  return (
    <div>
      <h1>Crypto Tracker</h1>
      <p>Track prices, explore the market, and build your watchlist.</p>

      <div>
        <input
          type="search"
          placeholder="Search Cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Search</button>
      </div>
      <section>
        {error && <p>{error}</p>}
        {isLoading && <p>Loading Cryptocurrencies</p>}
        {!isLoading && (
          <table>
            <thead>
              <tr>
                <th
                  colSpan={5}
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
                <th>image</th>
                <th>Id</th>
                <th>Coin</th>
                <th>Symbol</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id}>
                  <td>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width="24"
                      height="24"
                    />
                  </td>
                  <td>{coin.id}</td>
                  <td>{coin.name}</td>
                  <td>{coin.symbol}</td>
                  <td>{coin.current_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div></div>
    </div>
  );
}

export default App;
