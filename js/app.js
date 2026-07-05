const dataUrl = "data/ridership.json";

let ridershipData = [];

function formatNumber(number) {
    return number.toLocaleString();
}

function formatMillions(number) {
    return `${(number / 1000000).toFixed(1)}M`;
}

function formatMillionsWithLabel(number) {
    return `${(number / 1000000).toFixed(1)}M riders`;
}

function getFullMonthName(month) {
    const months = {
        Jan: "January",
        Feb: "February",
        Mar: "March",
        Apr: "April",
        May: "May",
        Jun: "June",
        Jul: "July",
        Aug: "August",
        Sep: "September",
        Oct: "October",
        Nov: "November",
        Dec: "December"
    };

    return months[month] || month;
}

function filterData(data, filter) {
    const quarters = {
        Q1: ["Jan", "Feb", "Mar"],
        Q2: ["Apr", "May", "Jun"],
        Q3: ["Jul", "Aug", "Sep"],
        Q4: ["Oct", "Nov", "Dec"]
    };

    if (filter === "all") {
        return data;
    }

    return data.filter(item => quarters[filter].includes(item.month));
}

function updateDashboard(data) {
    updateKpiCards(data);
    populateTable(data);
    updateInsights(data);
    createRidershipChart(data);
}

function updateKpiCards(data) {
    const total = data.reduce((sum, item) => sum + item.ridership, 0);
    const average = total / data.length;

    const highest = data.reduce((max, item) =>
        item.ridership > max.ridership ? item : max
    );

    const lastMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];

    const momChange =
        ((lastMonth.ridership - previousMonth.ridership) / previousMonth.ridership) * 100;

    document.getElementById("totalRidership").textContent = formatMillions(total);
    document.getElementById("averageRidership").textContent = formatMillions(average);

    document.getElementById("highestMonth").innerHTML = `
        <span class="kpi-main">${getFullMonthName(highest.month)}</span>
        <span class="kpi-sub">${formatMillions(highest.ridership)}</span>
    `;

    const momElement = document.getElementById("momChange");
    const arrow = momChange >= 0 ? "▲" : "▼";

    momElement.innerHTML = `
        <span class="change-arrow">${arrow}</span>
        <span>${Math.abs(momChange).toFixed(1)}%</span>
    `;

    momElement.classList.remove("positive", "negative");
    momElement.classList.add(momChange >= 0 ? "positive" : "negative");
}

function populateTable(data) {
    const tableBody = document.querySelector("#ridershipTable tbody");

    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${getFullMonthName(item.month)}</td>
            <td>${formatNumber(item.ridership)}</td>
        `;

        tableBody.appendChild(row);
    });
}

function updateInsights(data) {
    const insightsList = document.getElementById("insights");

    const highest = data.reduce((max, item) =>
        item.ridership > max.ridership ? item : max
    );

    const lowest = data.reduce((min, item) =>
        item.ridership < min.ridership ? item : min
    );

    const firstMonth = data[0];
    const lastMonth = data[data.length - 1];

    const periodChange =
        ((lastMonth.ridership - firstMonth.ridership) / firstMonth.ridership) * 100;

    insightsList.innerHTML = `
        <li>
            <strong>System Summary</strong>
            <span>Ridership reached its peak in ${getFullMonthName(highest.month)}, with ${formatMillionsWithLabel(highest.ridership)}.</span>
        </li>
        <li>
            <strong>Lowest Activity</strong>
            <span>${getFullMonthName(lowest.month)} recorded the lowest ridership, with ${formatMillionsWithLabel(lowest.ridership)}.</span>
        </li>
        <li>
            <strong>Period Trend</strong>
            <span>Ridership changed ${periodChange.toFixed(1)}% from ${getFullMonthName(firstMonth.month)} to ${getFullMonthName(lastMonth.month)}.</span>
        </li>
    `;
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            const filteredData = filterData(ridershipData, filter);

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            updateDashboard(filteredData);
        });
    });
}

async function loadRidershipData() {
    try {
        const response = await fetch(dataUrl);

        if (!response.ok) {
            throw new Error("Unable to load ridership data");
        }

        ridershipData = await response.json();

        updateDashboard(ridershipData);
        setupFilterButtons();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

loadRidershipData();