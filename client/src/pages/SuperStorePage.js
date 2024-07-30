import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
export default function SuperStorePage() {
  const url = "http://localhost:5000/getAllData";
  const [data, setData] = useState([]);
  const [recordPerPage, setRecordPerPage] = useState(10); // จำนวนแถวที่แสดง
  const [pageNo, setPageNo] = useState(1); // หน้าปัจจุบันที่แสดง
  const [totalRecords, setTotalRecords] = useState(0); // จำนวนข้อมูลทั้งหมด 10933 / 10 = 1093.3 => 1094
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    axios
      .get(url, {
        params: {
          recordPerPage: recordPerPage,
          pageNo: pageNo,
        },
      })
      .then((response) => {
        const _data = response.data;
        setData(_data.data);
        setTotalRecords(_data.totalRecords);
        setTotalPages(Math.ceil(_data.totalRecords / recordPerPage));
      });
  }, []);
  const onNextPage = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
    }
  };
  const onPrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };
  const fetchData = () => {
    axios
      .get(url, {
        params: {
          recordPerPage: recordPerPage,
          pageNo: pageNo,
          orderId: orderId,
          country: country,
          productName: productName,
        },
      })
      .then((response) => {
        const _data = response.data;
        setData(_data.data);
        setTotalRecords(_data.totalRecords);
        setTotalPages(Math.ceil(_data.totalRecords / recordPerPage));
      });
  };
  useEffect(() => {
    fetchData();
  }, [pageNo]);
  useEffect(() => {
    setPageNo(1);
    fetchData();
  }, [recordPerPage]);
  const [orderId, setOrderId] = useState("");
  const [country, setCountry] = useState("");
  const [productName, setProductName] = useState("");

  const onEdit = (_id) => {
    window.location = `/order/edit/${_id}`;
  }
  const onDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/deleteProduct/${_id}`).then((response) => {
          if(response.data.status_code == 200) {
            fetchData();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          } else {
            Swal.fire({
              title: "Not found!",
              text: "Not found data",
              icon: "error"
            });
          }
        })
      }
    });
  }
  
  return (
    <>
      <div className="grid grid-cols-3 gap-5">
        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Order ID</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="w-full input input-bordered"
            onKeyUp={(e) => setOrderId(e.target.value)}
          />
        </label>
        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Country/Region</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="w-full input input-bordered"
            onKeyUp={(e) => setCountry(e.target.value)}
          />
        </label>
        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Product Name</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="w-full input input-bordered"
            onKeyUp={(e) => setProductName(e.target.value)}
          />
        </label>
      </div>
      <div className="text-right">
        <button className="btn btn-outline" onClick={fetchData}>
          Search
        </button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <td colSpan={2}>Action</td>
              {data && data.length > 0
                ? Object.keys(data[0]).map((key, key_index) => {
                    // วนลูประดับคอลัมน์ของข้อมูล
                    return <th key={key}>{key}</th>;
                  })
                : null}
            </tr>
          </thead>
          <tbody>
            {data.map((record, record_index) => {
              // วนลูประดับแถวของข้อมูล
              return (
                <tr className="hover" key={`${record["_id"]}`}>
                  <td key={`edit${record["_id"]}`}>
                    <button className="btn btn-outline btn-warning" onClick={() => onEdit(record["_id"])}>
                      Edit
                    </button>
                  </td>
                  <td key={`delete${record["_id"]}`}>
                    <button className="btn btn-outline btn-error" onClick={() => onDelete(record["_id"])}>
                      Delete
                    </button>
                  </td>
                  {Object.keys(record).map((key, key_index) => {
                    // วนลูประดับคอลัมน์ของข้อมูล
                    return (
                      <td key={`${record_index}${key_index}`}>{record[key]}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="my-5 text-center">
        {/* start paging */}
        <div className="mr-5 join">
          <button className="join-item btn" onClick={onPrevPage}>
            «
          </button>
          <button className="join-item btn">Page {pageNo}</button>
          <button className="join-item btn" onClick={onNextPage}>
            »
          </button>
        </div>
        {/* end paging */}
        {/* start record per page */}
        <select
          className="w-full max-w-xs ml-5 select select-bordered"
          onChange={(e) => setRecordPerPage(e.target.value)}
        >
          {[10, 25, 50, 100].map((amount, index) => {
            return <option key={index}>{amount}</option>;
          })}
        </select>
        {/* end record per page */}
      </div>
    </>
  );
}
