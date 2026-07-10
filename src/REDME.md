# useFetch — Custom React Hook

A lightweight, reusable custom React hook that simplifies data fetching from any API. It handles loading state, error handling, and data management out of the box.

## Features

- Accepts any URL as a parameter
- Returns `data`, `loading`, and `error` states
- Automatically re-fetches when the URL changes
- Handles HTTP-level errors (4xx / 5xx) — not just network failures
- Resets stale state on each new request
- Zero dependencies beyond React


## The Hook

```js
import { useState, useEffect, useCallback } from "react";

function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}  
``````


## Demo App

The demo (`useFetch_demo.jsx`) is a self-contained React app that showcases the hook with four switchable endpoints:


The live **Hook State Visualizer** panel shows the real-time values of `loading`, `error`, and `data` as you switch endpoints.

### Running the Demo

Make sure you have a React environment set up (e.g. Vite or Create React App), then:

``bash
# 1. Install dependencies
npm install

# 2. Place useFetch_demo.jsx as your App entry point, then start
npm run dev
```

## How It Works

### State Reset on New Request
Before each fetch, `data` and `error` are reset to `null`. This prevents stale data from flashing on screen while a new request is in-flight.

### HTTP Error Handling
The native `fetch` API only throws on network failures. This hook explicitly checks `response.ok` and throws for 4xx/5xx status codes so they surface in the `error` state.

### Stable Callback with `useCallback`
`fetchData` is wrapped in `useCallback` with `url` as its only dependency. This ensures the function reference only changes when the URL changes, preventing unnecessary re-renders and redundant fetch calls.

### Guaranteed Cleanup with `finally`
The `finally` block ensures `loading` always returns to `false` — whether the request succeeds, fails, or throws an unexpected error.

## Requirements

- React 16.8 or higher (Hooks support)
- No external libraries required

## API Reference (dummy endpoints used in demo)

All endpoints are provided by [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — a free, public REST API for testing and prototyping.

## License

MIT — free to use in personal and commercial projects.