import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
export default function OrderFormPage() {
    const { _id } = useParams();
    const [fields, setFields] = useState([]);
    const [data, setData] = useState({});
    useEffect(() => {
        axios.get('http://localhost:5000/getField').then((response) => {
            setFields(response.data)
            console.log(fields);
        })

        if (_id) { //edit 🙃
            axios.get(`http://localhost:5000/getData/${_id}`).then((response) => {
                setData(response.data);
                console.log("data", data);
            })
        }
    }, []);
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name
        setData(values => ({...values, [name]: value}));
        console.log("Edit Data", data);
    }
    const submit = () => {
        if(_id) { //edit
            axios.put(`http://localhost:5000/editProduct/${_id}`, data).then((response) => {
                if(response.data.status_code == 200) {
                    Swal.fire('Success', 'Edit successfully', 'success').then(() => cancel());
                }else {
                    Swal.fire('Fail', 'Can\'t insert', 'error');
                }
            })
        } else { // add
            axios.post(`http://localhost:5000/createProduct`, data).then((response) => {
                if(response.data.status_code == 200) {
                    Swal.fire('Success', 'Add successfully', 'success').then(() => cancel());
                }else {
                    Swal.fire('Fail', 'Can\'t insert', 'error');
                }
                console.log(data);
            })
        }
    }
    const cancel = () => {
        window.location = 'http://localhost:3000/superstore';
    }
    return <>
        {/* {_id} */}
        <div className="grid grid-cols-3 gap-5">
            {fields.map((field, index) => {
                return <label className="w-full form-control" key={field.name}>
                    <div className="label">
                        <span className="label-text">
                            {field.name}
                        </span>
                    </div>
                    <input type={field.type == "Number" ? "number" : "texts"} placeholder="Type here" className="w-full input input-bordered" defaultValue={data[field.name]} name={field.name} onKeyUp={handleChange}></input>
                </label>
            })}
        </div>
        <div className="flex justify-end gap-5 mt-5">
            <button className="btn btn-outline btn-success" onClick={submit}>Submit</button>
            <button className="btn btn-outline" onClick={cancel}>Cancel</button>
        </div>
    </>
}