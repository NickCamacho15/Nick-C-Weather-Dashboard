
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

let searchHistoryDiv = document.getElementById('search-history');
searchHistory.forEach(city => {
    let cityBtn = document.createElement('button');
    cityBtn.textContent = city;
    cityBtn.addEventListener('click', function() {
        fetchWeather(city);
    });
    searchHistoryDiv.appendChild(cityBtn);
});

document.getElementById('search-btn').addEventListener('click', function() {
    let city = document.getElementById('city-input').value;
    fetchWeather(city);

    if(!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        let cityBtn = document.createElement('button');
        cityBtn.textContent = city;
        cityBtn.addEventListener('click', function() {
            fetchWeather(city);
        });
        searchHistoryDiv.appendChild(cityBtn);
    }
});

function fetchWeather(city) {
    let apiKey = '28e478b3e8297e32be43d0f93e50bf4e';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('No cities match your search. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('current-weather').innerHTML = `
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
                City: ${data.name}<br>
                Date: ${new Date().toLocaleDateString()}<br>
                Temperature: ${data.main.temp}F<br>
                Humidity: ${data.main.humidity}%<br>
                Wind Speed: ${data.wind.speed}MPH<br>
            `;
        })
        .catch(error => {
            alert(error.message);
        });

    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('No cities match your search. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            let forecastHTML = '';

            for(let i = 0; i < data.list.length; i += 8) {
                forecastHTML += `
                    <div class="forecast-card">
                        <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="Weather Icon">
                        Date: ${new Date(data.list[i].dt_txt).toLocaleDateString()}<br>
                        Temperature: ${data.list[i].main.temp}F<br>
                        Humidity: ${data.list[i].main.humidity}%<br>
                        Wind Speed: ${data.list[i].wind.speed}MPH<br>
                    </div>
                `;
            }

            document.getElementById('forecast').innerHTML = forecastHTML;
        })
        .catch(error => {
            alert(error.message);
        });
}
