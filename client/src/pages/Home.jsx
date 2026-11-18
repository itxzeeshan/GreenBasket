import { useEffect, useState } from "react";
import { getHealth } from "../api/client.js";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getHealth()
      .then((data) => {
        if (!cancelled) setHealth(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h1>GreenBasket</h1>
      <p>Local grocery marketplace</p>

      <p id="api-status">
        {loading && "Connecting to API…"}
        {!loading && error && `API error: ${error}`}
        {!loading && health && `API status: ${health.status}`}
      </p>

      {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
    </main>
  );
};

export default Home;
