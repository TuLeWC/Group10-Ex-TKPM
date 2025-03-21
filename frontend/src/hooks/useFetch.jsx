import { useEffect, useState } from "react";
import { fetchDataFromAPI } from "../ultis/api";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setData(null);
            setError(null);
            try {
                const response = await fetchDataFromAPI(url);
                setData(response);
            } catch (error) {
                setError(error?.message || "API call failed");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url]); 

    return {data, isLoading, error}
}

export default useFetch