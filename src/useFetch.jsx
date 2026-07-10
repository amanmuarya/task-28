import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // We use an AbortController to handle component unmounting
        const abortController = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url, { signal: abortController.signal });

                // Fetch does not automatically throw errors for bad HTTP statuses (e.g., 404, 500)
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                // Ignore the error if it was caused by our own abort controller
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function runs when the component unmounts or URL changes
        return () => abortController.abort();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;