import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState([]);
    const [years, setYears] = useState([]);
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getYear = () => {
        axios.get(`http://localhost:5000/getYear`).then((response) => {
            setYears(response.data);
        })
    }

    const getChart = (year = 2017) => {
        axios.get(`http://localhost:5000/chartSaleAndProfit`, {params: {year: year}}).then((response) => {
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

    useEffect(() => {
        getYear();
        getChart();
    }, []);

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
        </div>
    </>;
}