import React, {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";
import {ChartsAxis, ChartsXAxis, ChartsYAxis, LineChart} from "@mui/x-charts";
import {Box, Typography} from "@mui/material";

interface RegisteringStat{
    year: number,
    month: number,
    registrations: number
}

export default function RegisteringLineChart(){
    const [data, setData] = useState<RegisteringStat[]>([]);



    useEffect(() => {
        const fetchStatDate = async () => {
            const token = await authService.getAccessToken();
            if (!token) return;

            try {
                const response = await fetch("api/Users/stats", {
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

        fetchStatDate();
    }, []);

    
    const xLabels = data.map((item) => 
        new Date(item.year, item.month - 1 )
            .toLocaleDateString("default", { year: "numeric", month: "short" })
    );
    
    const registrations = data.map((item) => item.registrations);
    
    console.log("xLabels:", xLabels);
    console.log("registrations:", registrations);
    
    return(
        <Box
            sx={{
                mx: 'auto',
                width: 'fit-content',
                backgroundColor: "#1e1e2e",
                p: 2,
                borderRadius: 5
            }}
        >
            <Typography variant="h5" component="h2" sx={{ color: "#00ff41" }} gutterBottom>
                Monthly System Registrations
            </Typography>
            
            <LineChart
                xAxis={[{
                    scaleType: "point",
                    data: xLabels,
                    label: "Month",
                    tickLabelStyle: { angle: 45, textAnchor: 'start', fontSize: 12 },
                }]}

                series={[{
                    data: registrations,
                    color: "#00ff41",
                    showMark: true,
                }]}
                width={1200}
                height={500}
                margin={{ top: 20, right: 10, bottom: 10, left: 10 }}
            >
                <ChartsXAxis
                    label={"Month"}
                    labelStyle={{
                        fill: "#00ff41"
                    }}
                    sx={{
                        '& .MuiChartsAxis-line': { stroke: '#00ff41' },
                        '& .MuiChartsAxis-tick': { stroke: '#00ff41' },
                        '& .MuiChartsAxis-tickLabel': { fill: '#00ff41' },
                        '& .MuiChartsAxis-grid': {
                            stroke: '#00ff41',
                            strokeDasharray: '4 8',
                            strokeWidth: 1.2,
                            opacity: 0.35,
                        },
                    }}
                />
                <ChartsYAxis
                    label={"Registrations"}
                    labelStyle={{
                        fill: "#00ff41"
                    }}
                    sx={{
                        '& .MuiChartsAxis-line': { stroke: '#00ff41' },
                        '& .MuiChartsAxis-tick': { stroke: '#00ff41' },
                        '& .MuiChartsAxis-tickLabel': { fill: '#00ff41' },
                        '& .MuiChartsAxis-grid': {
                            stroke: '#00ff41',
                            strokeDasharray: '4 8',
                            strokeWidth: 1.2,
                            opacity: 0.35,
                        },
                    }}
                />
            </LineChart>
        </Box>
    )

   
}