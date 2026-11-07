import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CoinChart({ coinId }) {
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState("7");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchChartData() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch historical price data");
        }

        const data = await response.json();

        const formattedData = data.prices.map(([timestamp, price]) => ({
          timestamp,
          price,
        }));

        if (!ignore) {
          setChartData(formattedData);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchChartData();

    return () => {
      ignore = true;
    };
  }, [coinId, days]);

  return (
    <div className="coin-chart">
      <h2>Price History</h2>

      <div className="chart-filters">
        <button onClick={() => setDays("1")}>1D</button>
        <button onClick={() => setDays("7")}>7D</button>
        <button onClick={() => setDays("30")}>30D</button>
      </div>

      {isLoading && <p>Loading chart...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis domain={["auto", "auto"]} />

            <Tooltip
              formatter={(value) =>
                `$${Number(value).toLocaleString("en-US")}`
              }
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CoinChart;