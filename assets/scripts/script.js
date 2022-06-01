let placeholder = 'Toronto';
let city;
let state;
let lat;
let lon;
let units = $('#units').attr('data-unit');
let unit = 'C';
let measurement = 'KMH';
let apiKey = '9e28551fe3b5a81f7e8fffbcca8d2a3d';
let searchBtn = $('#search');
let unitsBtn = $('#units');
let currentWeather = $('#cityShowing');
let outlook = $('#outlook');
let searchHistory = $('#history');
let history = [];

loadData();

function getLocation() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            lat = data[0].lat;
            lon = data[0].lon;
            city = data[0].name;
            province = data[0].state;
            addHistory();
            updateCurrentWeather();
            updateOutlook();
        })
}

function updateCurrentWeather() {
    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=hourly,daily&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            currentWeather.empty();
            console.log(data);
            let head = $('<h2>');
            let img = $('<img>');
            let temp = $('<h5>');
            let wind = $('<h5>');
            let humidity = $('<h5>');
            let uv = $('<h5>');

            if (province) head.text(`${city}, ${province}\n(${moment().format('D/M/YYYY')})`);
            else head.text(`${city}\n(${moment().format('D/M/YYYY')})`);

            head.addClass('card-header');

            img.attr('src', `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`)
            temp.text(`Temp: ${data.current.temp} ${unit}`);
            wind.text(`Wind: ${data.current.wind_speed} ${measurement}`);
            humidity.text(`Humidity: ${data.current.humidity}%`);
            uv.text(`UV Index: ${data.current.uvi}%`);


            currentWeather.append(head);
            currentWeather.append(img);
            currentWeather.append(temp);
            currentWeather.append(wind);
            currentWeather.append(humidity);
            currentWeather.append(uv);
        })
}

function updateOutlook() {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            outlook.empty();
            for (let i = 0; i < data.list.length; i+=8) {
                let card = $('<section>');
                card.addClass('card p-3');
                let head = $('<h2>');
                let img = $('<img>');
                let temp = $('<h5>');
                let wind = $('<h5>');
                let humidity = $('<h5>');

                head.text(`${data.list[i].dt_txt}`);

                head.addClass('card-header');

                img.attr('src', `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@4x.png`)
                temp.text(`Temp: ${data.list[i].main.temp}`);
                wind.text(`Wind: ${data.list[i].wind.speed} ${measurement}`);
                humidity.text(`Humidity: ${data.list[i].main.humidity}%`)

                card.append(head);
                card.append(img);
                card.append(temp);
                card.append(wind);
                card.append(humidity);

                outlook.append(card);
            }
        })
}

function addHistory() {
    if (!history.includes(city)) {
        history.push(city);
        let historyBtn = $('<button>');
        historyBtn.addClass('m-2');
        historyBtn.text(city);
        searchHistory.append(historyBtn);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function loadData() {
    history = JSON.parse(localStorage.getItem('searchHistory'));
    units = localStorage.getItem('units');

    //units = unitsBtn.attr('data-unit');
    unitsBtn.text(`Unit: ${units}`);

    if (units === 'Imperial') {
        unitsBtn.attr('data-unit', 'Imperial');
        unit = 'F';
        measurement = 'MPH';
    } else {
        unitsBtn.attr('data-unit', 'Metric');
        unit = 'C';
        measurement = 'KMH';
    }

    city = history[0];

    getLocation();

    for (let i = 0; i < history.length; ++i) {
        let historyBtn = $('<button>');
        historyBtn.addClass('m-2');
        historyBtn.text(history[i]);
        searchHistory.append(historyBtn);
    }
}

searchBtn.on('click', function() {
    city = $('#city').val();
    console.log(city);
    getLocation();
});

unitsBtn.on('click', function() {
    if (units === 'Metric') {
        unitsBtn.attr('data-unit', 'Imperial');
        unit = 'F';
        measurement = 'MPH';
    } else {
        unitsBtn.attr('data-unit', 'Metric');
        unit = 'C';
        measurement = 'KMH';
    }
    units = unitsBtn.attr('data-unit');
    localStorage.setItem('units', units);
    unitsBtn.text(`Unit: ${units}`);
    getLocation();
})

searchHistory.on('click', function() {
    event.preventDefault();
    if (event.target.matches('button')) {
        city = event.target.textContent;
        getLocation();
    }
})