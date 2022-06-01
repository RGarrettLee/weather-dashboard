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

console.log(units);

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
            let temp = $('<h5>');
            let wind = $('<h5>');
            let humidity = $('<h5>');
            let uv = $('<h5>');

            if (province) head.text(`${city}, ${province}\n(${moment().format('D/M/YYYY')})`);
            else head.text(`${city}\n(${moment().format('D/M/YYYY')})`);
            temp.text(`Temp: ${data.current.temp} ${unit}`);
            wind.text(`Wind: ${data.current.wind_speed} ${measurement}`);
            humidity.text(`Humidity: ${data.current.humidity}%`);
            uv.text(`UV Index: ${data.current.uvi}%`);


            currentWeather.append(head);
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
                card.addClass('card p-3 m-3');
                let head = $('<h2>');
                let temp = $('<h5>');
                let wind = $('<h5>');
                let humidity = $('<h5>');

                head.text(`${data.list[i].dt_txt}`);
                temp.text(`Temp: ${data.list[i].main.temp}`);
                wind.text(`Wind: ${data.list[i].wind.speed} ${measurement}`);
                humidity.text(`Humidity: ${data.list[i].main.humidity}%`)

                card.append(head);
                card.append(temp);
                card.append(wind);
                card.append(humidity);

                outlook.append(card);
            }
        })
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
    unitsBtn.text(`Unit: ${units}`);
})