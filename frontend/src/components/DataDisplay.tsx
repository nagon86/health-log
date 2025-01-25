import React, { useState, useEffect } from "react";
import axios from "axios";

const DataDisplay: React.FC = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized. Please login.");
            return;
        }
        try {
            const response = await axios.get("http://localhost:3001/data", {
                params: { startDate, endDate },
                headers: { Authorization: `Bearer ${token}`},
            });
            setData(response.data);
        } catch (error) {
            alert("Error fetching data");
        }
    };

    return (
        <div>
            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <label>End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <button onClick={fetchData}>Fetch Data</button>

            <ul>
                {data.map((entry: any) => (
                    <li key={entry.id}>
                        {entry.date} - {entry.category} - {entry.text} - {Object.keys(entry.medicine).join(',')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataDisplay;
