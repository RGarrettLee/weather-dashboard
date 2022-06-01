let placeholder = 'Toronto';
let city;
let state;
let lat;
let lon;
let units = $('#units').attr('data-unit');
let apiKey = '9e28551fe3b5a81f7e8fffbcca8d2a3d';
let searchBtn = $('#search');
let unitsBtn = $('#units');
let currentWeather = $('#cityShowing');

console.log(units);

function getLocation() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            lat = data[0].lat;
            lon = data[0].lon;
            city = data[0].name;
            province = data[0].state;
            updateCurrentWeather();
        })
}

function updateCurrentWeather() {
    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=hourly,daily&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            let head = $('h1');
            head.text(`${city} (${moment().format('D/M/YYYY')})`)
            currentWeather.append(head);
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
    } else {
        unitsBtn.attr('data-unit', 'Metric');
    }
    units = unitsBtn.attr('data-unit');
    unitsBtn.text(`Unit: ${units}`);
})