import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function OrderFormPage() {
    const {_id} = useParams();
    const [fields, setFields] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/getField').then((response) => {
            setFields(response.data);
        })
    }, []);
    return <>
        {_id}
    </>
}