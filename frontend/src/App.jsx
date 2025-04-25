import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
function App() {
    const [yesterdayCount, setYesterdayCount] = useState(0);
    const [alertTrend, setAlertTrend] = useState([]);
    const [recentTrends, setRecentTrends] = useState('');
    const [highlightedAlerts, setHighlightedAlerts] = useState([]);
    const [aiResponse, setAiResponse] = useState('');
    const [aiQuery, setAiQuery] = useState('');

    useEffect(() => {
        // Fetch data for yesterday's count
        axios.get('/api/alerts/yesterday').then(response => {
            setYesterdayCount(response.data.count);
        });

        // Fetch data for alert trend graph
        axios.get('/api/alerts/trend').then(response => {
            setAlertTrend(response.data.trend);
        });

        // Fetch recent trends text
        axios.get('/api/alerts/recent-trends').then(response => {
            setRecentTrends(response.data.text);
        });

        // Fetch highlighted alerts
        axios.get('/api/alerts/highlights').then(response => {
            setHighlightedAlerts(response.data.alerts);
        });
    }, []);

    const handleAiQuery = () => {
        axios.post('/api/alerts/ai-query', { query: aiQuery }).then(response => {
            setAiResponse(response.data.response);
        });
    };

    useEffect(() => {
        if (alertTrend.length > 0) {
            // 棒グラフのデータを作成
            const labels = alertTrend.map(item => item.date);
            const data = alertTrend.map(item => item.count);
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'アラート件数',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            };
            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'アラート件数推移',
                        },
                    },
                },
            };            


        }
    }, [alertTrend]);

    return (
        <div>
            <h1>サマリー</h1>
            <div>
                <h2>前日の件数</h2>
                <p>{yesterdayCount} 件</p>
            </div>
            <div>
                <h2>アラート件数推移のグラフ</h2>
                <Bar
                    data={{
                        labels: alertTrend.map(item => item.date),
                        datasets: [
                            {
                                label: 'アラート件数',
                                data: alertTrend.map(item => item.count),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'アラート件数推移',
                            },
                        },
                    }}
                />
            </div>
            <div>
                <h2>最近の傾向</h2>
                <p>{recentTrends}</p>
            </div>
            <div>
                <h2>ハイライトされたアラート</h2>
                <ul>
                    {highlightedAlerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>AIに質問する</h2>
                <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="質問を入力してください"
                />
                <button onClick={handleAiQuery}>送信</button>
                <p>{aiResponse}</p>
            </div>
        </div>
    );
}

export default App;
