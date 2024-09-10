import axios from "axios";
import { useEffect, useState } from "react";

export default function ModalComponent(props) {
    const { modalContent, handleCloseModal } = props;
    const { year, month, productName } = modalContent;
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/topTenDetail`, {
            params: { year: year, month: month, productName: productName }
        }).then((response) => {
            setData(response.data);
        });
    });

    return (
        <>
            <div className="modal modal-open">
                <div className="artboard artboard-demo artboard-horizontal phone-5">
                    <h2 className="text-lg font-bold">Details</h2>
                    <div className="w-full p-5">
                        <div className="text-left">
                            <strong>Product:</strong> {modalContent.productName}
                        </div>
                        <div className="w-full text-left">
                            <strong>Quantity:</strong> {modalContent.quantity}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    {data.length > 0
                                        ? Object.keys(data[0]).map((key) => (
                                            <th key={key}>{key}</th>
                                        ))
                                        : null}
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0
                                    ? data.map((order, order_index) => (
                                        <tr key={order_index}>
                                            {Object.keys(order).map((key) => (
                                                <td key={`${order_index}-${key}`}>{order[key]}</td>
                                            ))}
                                        </tr>
                                    ))
                                    : <tr><td colSpan="100%">No data available</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
}
