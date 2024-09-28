document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form input values
    const searchStartLocation = document.getElementById('searchStartLocation').value.trim();
    const searchEndLocation = document.getElementById('searchEndLocation').value.trim();

    // Load accident data from LocalStorage
    let storedData = localStorage.getItem('accidentReports');
    let accidentReports = storedData ? JSON.parse(storedData) : [];

    // Filter data to match the route
    const matchingAccidents = accidentReports.filter(report =>
        report.startLocation.toLowerCase() === searchStartLocation.toLowerCase() &&
        report.endLocation.toLowerCase() === searchEndLocation.toLowerCase()
    );

    // Check if any matching accidents were found
    if (matchingAccidents.length > 0) {
        // Group accidents by week or month
        const weeklyAccidents = groupAccidentsByWeek(matchingAccidents);
        renderWeeklyChart(searchStartLocation, searchEndLocation, weeklyAccidents);
    } else {
        alert('No accidents found on this route.');
    }
});

// Function to group accidents by week
function groupAccidentsByWeek(accidents) {
    const weeklyAccidents = {};

    accidents.forEach((accident) => {
        const accidentDate = new Date(accident.accidentDate); // Assuming date format is "YYYY-MM-DD"
        const weekNumber = getWeekNumber(accidentDate);

        if (!weeklyAccidents[weekNumber]) {
            weeklyAccidents[weekNumber] = 0;
        }
        weeklyAccidents[weekNumber]++;
    });

    return weeklyAccidents;
}

// Helper function to get the week number of a date
function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);  // Calculate the week number
}

// Function to render the weekly chart
function renderWeeklyChart(from, to, weeklyAccidents) {
    const ctx = document.getElementById('accidentChart').getContext('2d');

    // If a chart already exists, destroy it first
    if (window.accidentChart instanceof Chart) {
        window.accidentChart.destroy();
    }

    // Prepare data for the chart
    const weeks = Object.keys(weeklyAccidents);
    const accidentCounts = Object.values(weeklyAccidents);

    // Create new chart
    window.accidentChart = new Chart(ctx, {
        type: 'line',  // Line chart to show trends over time
        data: {
            labels: weeks.map(week => `Week ${week}`), // X-axis labels: Weeks
            datasets: [{
                label: `Accidents per week on ${from} to ${to}`,
                data: accidentCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Accidents'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week of the Year'
                    }
                }
            }
        }
    });
}
