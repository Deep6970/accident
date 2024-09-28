// Initialize variables
let map, marker;

document.getElementById('selectLocationBtn').addEventListener('click', function () {
    // Show the map modal
    $('#mapModal').modal('show');
    initializeMap();
});

function initializeMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India's center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // On map click, place a marker and get coordinates
    map.on('click', function (e) {
        const { lat, lng } = e.latlng;

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
    });

    // Close map modal
    document.getElementById('closeMapModal').addEventListener('click', function () {
        $('#mapModal').modal('hide');
    });

    // Confirm the location and set coordinates in the input
    document.getElementById('selectLocationConfirm').addEventListener('click', function () {
        if (marker) {
            const { lat, lng } = marker.getLatLng();
            document.getElementById('exactLocation').value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            $('#mapModal').modal('hide');
        } else {
            alert('Please select a location on the map.');
        }
    });
}

// Preview the uploaded image
document.getElementById('mediaUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const previewImg = document.getElementById('previewImg');
    const imagePreviewContainer = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result; // Set the image source to the file's result
            previewImg.classList.remove('hidden'); // Show the image
        }
        reader.readAsDataURL(file); // Read the file as a data URL
    } else {
        previewImg.classList.add('hidden'); // Hide the image if no file is selected
    }
});

// Form submission handling
document.getElementById('accidentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collecting form data
    const newRecord = {
        startLocation: document.getElementById('startLocation').value,
        endLocation: document.getElementById('endLocation').value,
        exactLocation: document.getElementById('exactLocation').value,
        areaCover: document.getElementById('areaCover').value,
        reason: document.getElementById('reason').value,
        accidentDate: document.getElementById('accidentDate').value,
        accidentTime: document.getElementById('accidentTime').value,
        media: document.getElementById('mediaUpload').files[0] ? document.getElementById('mediaUpload').files[0].name : null // Store file name or null
    };

    // Load existing data from LocalStorage
    let storedData = localStorage.getItem('accidentReports');
    let accidentReports = storedData ? JSON.parse(storedData) : [];

    // Append the new record
    accidentReports.push(newRecord);

    // Save back to LocalStorage
    localStorage.setItem('accidentReports', JSON.stringify(accidentReports));

    alert('Report submitted successfully!');
});

// Custom Bootstrap validation
(function () {
    'use strict';
    window.addEventListener('load', function () {
        const forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
