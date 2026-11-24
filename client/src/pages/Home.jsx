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
      <h1>GreenBasket — System status</h1>
      <p>Local grocery marketplace</p>

      <div id="api-status">
        {loading && <p>Connecting to API…</p>}

        {!loading && error && <p>API error: {error}</p>}

        {!loading && health && (
          <>
            <p>API: {health.status ?? "unknown"}</p>
            <p>Database: {health.db ?? "unknown"}</p>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
