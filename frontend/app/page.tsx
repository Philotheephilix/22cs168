"use client";
import { useState } from "react";
import log from "../utils/logger";

type Shortener = {
  shortLink: string;
  expiry: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [preferredCode, setPreferredCode] = useState("");
  const [expireTime, setExpireTime] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [stats, setStats] = useState<string | null>(null);

  function validateURL(url: string) {
    const pattern = /^(http|https):\/\/[^ "]+$/;
    return pattern.test(url);
  }

  async function handleShorten() {
    if (!validateURL(url)) {
      alert("Please enter a valid URL");
      log("frontend", "warn", "component", "Invalid URL entered by user");
      return;
    }

    const expire = Number(expireTime);
    if (!Number.isInteger(expire) || expire <= 0) {
      alert("Expire Time must be a positive integer.");
      log("frontend", "warn", "component", "Invalid expire time entered by user");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/shorturls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          preferredCode,
          expireTime: expire,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(JSON.stringify(data));
        log("frontend", "info", "component", "Short URL created successfully");
      } else {
        setResult(data.error || "An error occurred");
        log("frontend", "error", "component", `Server error: ${data.error}`);
      }
    } catch (err) {
      setResult("Network error");
      log("frontend", "error", "component", "Network error while shortening URL");
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>URL Shortner</h1>
      <h2>by Philotheephilix</h2>
      <input
        type="text"
        name="url"
        placeholder="Enter URL"
        required
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <input
        type="text"
        name="preferredCode"
        placeholder="Enter Preferred Code (optional)"
        value={preferredCode}
        onChange={e => setPreferredCode(e.target.value)}
      />
      <input
        type="number"
        name="expireTime"
        placeholder="Enter Expire Time in minutes (optional)"
        required
        value={expireTime}
        onChange={e => setExpireTime(e.target.value)}
      />
      <button type="button" onClick={handleShorten}>
        Shorten
      </button>
      <div id="result">
        {result && (() => {
          try {
            const parsed: Shortener = JSON.parse(result);
            if (parsed.shortLink && parsed.expiry) {
              return (
                <div>
                  <div>
                    Short Link:{" "}
                    <a href={parsed.shortLink} target="_blank">
                      {parsed.shortLink}
                    </a>
                  </div>
                  <div>Expires At: {new Date(parsed.expiry).toLocaleString()}</div>
                </div>
              );
            }
            return <div>Error: {result}</div>;
          } catch {
            return <div>Error: {result}</div>;
          }
        })()}
      </div>
      <div>
        <h2>fetch stats from shorturl</h2>
        <input type="text" name="url" placeholder="enter url to fetch stats" />
        <button
          type="button"
          onClick={async () => {
            try {
                const input = (document.querySelector('input[name="url"][placeholder="enter url to fetch stats"]') as HTMLInputElement)?.value;
                const res = await fetch(`http://localhost:3001/shorturls/${encodeURIComponent(input)}`, {
                method: "GET",
                });
              const data = await res.json();
              if (res.ok) {
                setStats(JSON.stringify(data));
                log("frontend", "info", "component", "Fetched stats successfully");
              } else {
                setStats(data.error || "An error occurred");
                log("frontend", "error", "component", `Server error: ${data.error}`);
              }
            } catch (err) {
              setStats("Network error");
              log("frontend", "error", "component", "Network error while fetching stats");
            }
          }}
        >
          Fetch Stats
        </button>
        <div>
          {stats && (
            <div>
              <h3>Stats:</h3>
              <pre>{stats}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
