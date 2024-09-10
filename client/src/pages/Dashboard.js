import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ModalComponent from "./components/ModalComponent";

export default function Dashboard() {
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState([]);
    const [years, setYears] = useState([]);

    const [options2, setOptions2] = useState({});
    const [series2, setSeries2] = useState([]);
    const [yearSelect, setYearSelect] = useState(2017);
    const [monthSelect, setMonthSelect] = useState(1);
    
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const getYear = () => {
        axios.get(`http://localhost:5000/getYear`).then((response) => {
            setYears(response.data);
        })
    }
    
    const getChart = (year = 2017) => {
        axios.get(`http://localhost:5000/chartSaleAndProfit`, { params: { year: year } }).then((response) => {
            setOptions({
                chart: {
                    id: 'basic-line'
                },
                xaxis: {
                    categories: response.data.map(e1 => monthList[e1._id.month - 1])
                }
            })
            setSeries([
                {
                    name: 'Sales',
                    data: response.data.map(e1 => e1.total_sales)
                },
                {
                    name: 'Profit',
                    data: response.data.map(e1 => e1.total_profits + e1.total_sales)
                },
            ])
        })
    }

    const getTopTen = () => {
        axios.get(`http://localhost:5000/chartTopTen`, { params: { year: yearSelect, month: monthSelect } }).then((response) => {
            console.log("Data" + response.data)
            setOptions2({
                chart: {
                    width: 380,
                    type: 'pie',
                    events: {
                        dataPointSelection: (event, chartContext, config) => {
                            const productName = config.w.config.labels[config.dataPointIndex];
                            const quantity = response.data[config.dataPointIndex].total_quantity;
                            setModalContent({
                                productName,
                                quantity,
                                year: yearSelect,
                                month: monthSelect
                            });
                            setShowModal(true);
                        }
                    }
                },
                labels: response.data.map(e1 => e1._id.productName),
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
                colors: [
                    '#FFB3B3',
                    '#B3FFB3',
                    '#B3B3FF',
                    '#FFB3D9',
                    '#B3FFFF',
                    '#FFFFB3',
                    '#FFCCB3',
                    '#CCFFB3',
                    '#FFB3FF',
                    '#B3FFCC'
                ]
            })
            setSeries2(response.data.map(e1 => e1.total_quantity))
        })
    }

    useEffect(() => {
        getYear();
        getChart();
        getTopTen();
    }, []);

    useEffect(() => {
        getTopTen();
    }, [yearSelect, monthSelect])

    const handleCloseModal = () => setShowModal(false); 

    return <>
        <h1>Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <select className="w-full my-5 select select-bordered" onChange={e1 => getChart(e1.target.value)}>
                    {
                        years.map(e1 => <option key={e1} value={e1}>{e1}</option>)
                    }
                </select>
                <Chart options={options} series={series} type="line" />
            </div>
            <div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <select className="w-full my-5 select select-bordered" onChange={e1 => setYearSelect(e1.target.value)}>
                        {
                            years.map(e1 => <option key={e1} value={e1}>{e1}</option>)
                        }
                    </select>
                    <select className="w-full my-5 select select-bordered" onChange={e1 => setMonthSelect(e1.target.value)}>
                        {
                            monthList.map((e1, index) => <option key={e1} value={index + 1}>{e1}</option>)
                        }
                    </select>
                </div>
                <Chart options={options2} series={series2} type="pie"/>
            </div>
        </div>

        {showModal && (
            <ModalComponent handleCloseModal={handleCloseModal} modalContent = {modalContent}/>
        )}
    </>;    
}