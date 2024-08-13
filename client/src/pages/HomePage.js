import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
  const url = "http://localhost:5000/getOrders";
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
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
          <tr>
              {data && data.length > 0
                ? Object.keys(data[0].Orders[0]).map((key, key_index) => {
                    // วนลูประดับคอลัมน์ของข้อมูล
                    return <th key={key}>{key}</th>;
                  })
                : null}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 && data[0].Orders[0]
            ?
            data.map((orders, orders_index) => {
              return orders.Orders.map((order, order_index) => {
                return <tr key={order_index}>
                  {
                    Object.keys(order).map((key, key_index) => {
                      const list = [
                        "Order ID",
                        "Ship Mode",
                        "Customer ID",
                        "Customer Name",
                        "Segment",
                        "City",
                        "State",
                        "Country/Region",
                        "Region"
                      ];
                      return (
                        order_index > 0 && list.includes(key) ?
                        null :
                        <td key={`${order_index}${key_index}`} rowSpan={list.includes(key) ? orders.Orders.length : null}>
                          {order[key]}
                        </td>
                      );
                    })
                  }
                </tr>
              })
            })
            : null }
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