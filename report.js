document.getElementById('loadDataBtn').addEventListener('click', function() {
    // Load data from LocalStorage
    let storedData = localStorage.getItem('accidentReports');
    let accidentReports = storedData ? JSON.parse(storedData) : [];

    if (accidentReports.length > 0) {
        displayAccidentReports(accidentReports);
    } else {
        alert('No accident reports found.');
    }
});

// Search Button functionality
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchStartLocation = document.getElementById('searchStartLocation').value.trim().toLowerCase();
    const searchEndLocation = document.getElementById('searchEndLocation').value.trim().toLowerCase();

    // Load data from LocalStorage
    let storedData = localStorage.getItem('accidentReports');
    let accidentReports = storedData ? JSON.parse(storedData) : [];

    if (accidentReports.length > 0) {
        // Filter reports based on search criteria
        const filteredReports = accidentReports.filter(report => 
            report.startLocation.toLowerCase() === searchStartLocation && 
            report.endLocation.toLowerCase() === searchEndLocation
        );
        
        if (filteredReports.length > 0) {
            displayAccidentReports(filteredReports);
        } else {
            alert('No matching accident reports found for the specified route.');
        }
    } else {
        alert('No accident reports found.');
    }
});

function displayAccidentReports(reports) {
    const container = document.getElementById('reportContainer');
    container.innerHTML = ''; // Clear previous reports

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'col-md-4 mb-4'; // Bootstrap column for responsive layout

        reportCard.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h2 class="card-title font-weight-bold">Route: ${report.startLocation} to ${report.endLocation}</h2>
                    <p><strong>Exact Location:</strong> ${report.exactLocation}</p>
                    <p><strong>Area Cover:</strong> ${report.areaCover} km²</p>
                    <p><strong>Reason:</strong> ${report.reason}</p>
                    <p><strong>Date:</strong> ${report.accidentDate}</p>
                    <p><strong>Time:</strong> ${report.accidentTime}</p>
                    ${report.media ? `<img src="${report.media}" class="img-fluid mt-2" alt="Accident Media">` : ''}
                </div>
            </div>
        `;

        container.appendChild(reportCard);
    });
}
