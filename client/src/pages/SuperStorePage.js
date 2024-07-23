import axios from "axios";
import { useEffect, useState } from "react";

export default function SuperStorePage() {
  const url = "http://localhost:5000/getAllData";
  const [data, setData] = useState([]);
  const [recordPerPage, setRecordPerPage] = useState(10); //จำนวนแถวที่แสดง
  const [pageNo, setPageNo] = useState(1); //หน้าปัจจุบัน
  const [totalRecords, setTotalRecords] = useState(0); //จำนวนข้อมูลทั้งหมด 10933 / 10 = 1093.3 => 1094
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  })
  
  const onNextPage = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
    }
  }

  const onPrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  }

  const fetchData = () => {
    axios
      .get(url, {
        params: {
          recordPerPage: recordPerPage,
          pageNo: pageNo,
          orderId: orderId,
          country: country,
          product: product
        },
      })
      .then((response) => {
        const _data = response.data;
        setData(_data.data);
        setTotalRecords(_data.totalRecords);
        setTotalPages(Math.ceil(_data.totalRecords / recordPerPage));
      });
  }

  useEffect(() => {
    fetchData();
  }, [pageNo]);
  useEffect(() => {
    setPageNo(1);
    fetchData();
  }, [recordPerPage])
  // useEffect(() => {
  //   alert("Data is updated");
  // }, [data]);

  const [orderId, setOrderId] = useState("");
  const [country, setCountry] = useState("");
  const [product, setProduct] = useState("");
  return (
    <>
      <div className="grid grid-cols-3 gap-5">
        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Order ID</span>
          </div>
          <input type="text"
            placeholder="Type Here"
            className="w-full input input-bordered"
            onKeyUp={e => setOrderId(e.target.value)}>
          </input>
        </label>

        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Contry/Region</span>
          </div>
          <input type="text"
            placeholder="Type Here"
            className="w-full input input-bordered"
            onKeyUp={e => setCountry(e.target.value)}>
          </input>
        </label>

        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Product Name</span>
          </div>
          <input type="text"
            placeholder="Type Here"
            className="w-full input input-bordered"
            onKeyUp={e => setProduct(e.target.value)}>
          </input>
        </label>
        
      </div>

      <div className="text-right">
        <button class="btn btn-outline" onClick={fetchData}>Search</button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <td colSpan={2}>Action</td>
              {
                data && data.length > 0 ? Object.keys(data[0]).map((key, key_index) => {
                  return <th key={key}>{key}</th>;
                }) : null
              }
            </tr>
          </thead>
          <tbody>
            {data.map((record, record_index) => {
              return (
                <tr className="hover" key={`${record['_id']}`}>
                  <td key={`edit${record["id"]}`}>
                    <button className="btn btn-outline btn-warning">Edit</button>
                  </td>
                  <td key={`delete${record["_id"]}`}>
                    <button className="btn btn-outline btn-error">Delete</button>
                  </td>
                  {Object.keys(record).map((key, key_index) => {
                    return <td key={`${record_index}${key_index}`}>{record[key]}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="my-5 text-center">
        <div className="mr-5 join">
          <button className="join-item btn" onClick={onPrevPage}>«</button>
          <button className="join-item btn">Page {pageNo}</button>
          <button className="join-item btn" onClick={onNextPage}>»</button>
        </div>
        <select className="w-full max-w-xs ml-5 select select-bordered"
          onChange={e => setRecordPerPage(e.target.value)}>
          {
            [10, 25, 50, 100].map((amount, index) => {
              return <option key={index}>{amount}</option>
            })
          }
        </select>
      </div>
    </>
  );
}
