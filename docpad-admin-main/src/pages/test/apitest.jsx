import React from "react";
import { useUserCustome} from "../../hooks/testhooks/useApi";
const Showdata = () => {
        const {data, error, loading} = useUserCustome('https://jsonplaceholder.typicode.com/posts')

        if(loading){
            console.log(loading)
            return <p> api data loading ..</p>
        }
        if(error){
            console.log(error)
            return <p> Error to fecting data ..</p>
        }

        return(
            <>
                <pre> {JSON.stringify(data, null, 2)} </pre>
            </>
        )
}

export default Showdata;