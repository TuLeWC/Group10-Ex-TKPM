import { useState } from "react";
import { postDataToAPI } from "../ultis/api";

const usePost = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const postData = async (body) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await postDataToAPI(url, body);
            setData(response);
        } catch (error) {
            setError(error?.message || "API call failed");
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, postData };
};

export default usePost;