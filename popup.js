let lastGeneratedTime = 0;
const refreshTime = 60000; // 1 minute in milliseconds
const defaultPassword = 'manojgowda';

document.addEventListener('DOMContentLoaded', checkPassword);

function checkPassword() {
    const storedPassword = localStorage.getItem('userPassword');
    if (storedPassword === defaultPassword) {
        showMainScreen();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginButton').addEventListener('click', verifyPassword);
}

function showMainScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    generateAddress();
}

function verifyPassword() {
    const passwordInput = document.getElementById('passwordInput').value;

    if (passwordInput === defaultPassword) {
        localStorage.setItem('userPassword', passwordInput);
        showMainScreen();
    } else {
        alert('Incorrect password. Please try again.');
    }
}

function generateAddress() {
    const currentTime = Date.now();

    if (currentTime - lastGeneratedTime < refreshTime) {
        return; 
    }

    lastGeneratedTime = currentTime;
    const ipApiUrl = 'https://api.ipify.org/?format=json';

    fetch(ipApiUrl)
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            getUserLocation(ip);
        })
        .catch(error => {
            console.error('Error fetching user IP:', error);
            displayError();
        });
}

function getUserLocation(ip) {
    const geoApiUrl = `https://ipwhois.app/json/${ip}`;

    fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            const userLocation = {
                ip: data.ip,
                city: data.city,
                state: data.region,
                country: data.country,
                postcode: data.postal,
                latitude: data.latitude,
                longitude: data.longitude
            };

            document.getElementById('ip').value = `${userLocation.ip} (${userLocation.country})`;
            document.getElementById('vpnCountry').value = userLocation.country;
            fetchRandomAddress(userLocation);
        })
        .catch(error => {
            console.error('Error fetching user location:', error);
            displayError();
        });
}

function fetchRandomAddress(location) {
    const apiUrl = `https://randomuser.me/api/?nat=us`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const address = data.results[0].location;
            document.getElementById('street').value = `${address.street.number} ${address.street.name}`;
            document.getElementById('city').value = location.city || address.city;
            document.getElementById('state').value = location.state || address.state;
            document.getElementById('zip').value = location.postcode || address.postcode;
            document.getElementById('country').value = location.country || address.country;
        })
        .catch(error => {
            console.error('Error fetching address:', error);
            displayError();
        });
}

function displayError() {
    document.getElementById('street').value = '123, Sample Street';
    document.getElementById('city').value = 'Delhi';
    document.getElementById('state').value = 'Delhi';
    document.getElementById('zip').value = '110001';
    document.getElementById('country').value = 'India';
    document.getElementById('vpnCountry').value = '';
}

// Open LinkedIn page
document.getElementById('footer').addEventListener('click', function() {
    window.open('https://manojgowda.onrender.com/linkedin', '_blank');
});
