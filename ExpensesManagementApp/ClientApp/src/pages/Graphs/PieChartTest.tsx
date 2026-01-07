import {PieChart} from "@mui/x-charts";
import {authService} from "../../../services/AuthService.tsx";
import {useEffect, useState} from "react";

interface CategoryStat{
    count : number,
    name : string
}

export default function PieChartTest() {
    const [data, setData] = useState<CategoryStat[]>([]);

    useEffect(() => {
        const fetchStatData = async () => {
            const token = await authService.getAccessToken();
            if (!token) return;

            try {
                const response = await fetch("api/Expenses/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Bad response");

                const result = await response.json();
                console.log("Received data:", result);

                setData(result);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchStatData();
    }, []);

    const pieData = data.map((item, index) => ({
        id: index,
        value: item.count,
        label: item.name || "Other",
    }));

    if (pieData.length === 0) {
        return <div>Loading or no data...</div>;
    }

    return (
        <PieChart 
            series={[{
                data: pieData,
                
                cornerRadius: 10,
                innerRadius: 30,
                outerRadius: 125,
                paddingAngle: 3,
            }]}
            width={260}
            height={260}
            
            slotProps={{
                legend:{
                    sx:{
                        color: '#d6d6d6'
                    }
                }
            }}
            
            
        />
    );
}