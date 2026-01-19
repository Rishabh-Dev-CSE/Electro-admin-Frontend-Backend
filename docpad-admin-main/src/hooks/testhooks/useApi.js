import { useState, useEffect } from "react"

export function useUserCustome(url){
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
 
    useEffect(() => {
        setLoading(true)
        fetch(url)
        .then(res => res.json())
        .then(res => setData(res))
        .catch(err => setError(err))
        .finally( () => setLoading(false))

    },[url])

    return{data,error,loading}

}