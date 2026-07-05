let ridershipChart;

function createRidershipChart(data) {
    const months = data.map(item => item.month);
    const riders = data.map(item => item.ridership);

    const ctx = document
        .getElementById("ridershipChart")
        .getContext("2d");

    if (ridershipChart) {
        ridershipChart.destroy();
    }

    ridershipChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: months,
            datasets: [{
                label: "Monthly Ridership",
                data: riders,
                borderColor: "#005DAA",
                backgroundColor: "rgba(0,93,170,.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.35,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return (value / 1000000).toFixed(0) + "M";
                        }
                    }
                }
            }
        }
    });
}