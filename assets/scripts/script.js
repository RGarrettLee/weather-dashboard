let city = 'Toronto'; // setting default search to Toronto
let state; // initializing variables used for storing data
let lat; // <<
let lon; // << 
let units = $('#units').attr('data-unit'); // setting the unit type based on data-unit attribute
let unit = 'C'; // used for temp designation
let measurement = 'KMH'; // used for speed designation
let apiKey = '9e28551fe3b5a81f7e8fffbcca8d2a3d'; // key for the API
let searchBtn = $('#search'); // search button element
let unitsBtn = $('#units'); // units button element
let currentWeather = $('#cityShowing'); // current weather card element
let outlook = $('#outlook'); // 5 day outlook card element
let searchHistory = $('#history'); // search history card element
let history = []; // array to hold search history

loadData(); // load saved data

function getLocation() { // make a request to the API to get information about the city searched
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            lat = data[0].lat;
            lon = data[0].lon;
            city = data[0].name;
            province = data[0].state;
            addHistory(); // add current search to the search history
            updateCurrentWeather(); // use the fetched data to update the current weather card
            updateOutlook(); // use the fetched data to update the 5 day outlook
        });
}

function updateCurrentWeather() { // make a request to the API to update the weather card
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=hourly,daily&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            currentWeather.empty(); // empty current weather card for new data
            let head = $('<h2>'); 
            let img = $('<img>');
            let temp = $('<h5>');
            let wind = $('<h5>');
            let humidity = $('<h5>');
            let uv = $('<h5>');

            if (province) head.text(`${city}, ${province}\n(${moment().format('D/M/YYYY')})`); // if the city has a state/province tied to it, put it in the weather card
            else head.text(`${city}\n(${moment().format('D/M/YYYY')})`); // if the city does not have a state/province tied to it, ignore it

            head.addClass('card-header');

            img.attr('src', `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`); // add weather icon
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
        });
}

function updateOutlook() { // make a request to the API to update the 5 day outlook data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            outlook.empty();
            for (let i = 0; i < data.list.length; i+=8) {
                let card = $('<section>'); // create elements to generate data
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
        });
}

function addHistory() { // add a snewly searched city to the search history if its not already in there
    if (!history.includes(city)) {
        history.push(city);
        let historyBtn = $('<button>');
        historyBtn.addClass('m-2');
        historyBtn.text(city);
        searchHistory.append(historyBtn);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function loadData() { // load all saved data and update data
    units = localStorage.getItem('units'); // load users unit preferences

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

    getLocation(); // search location 

    history = JSON.parse(localStorage.getItem('searchHistory')); // load user's search history

    if (history !== null) {
        for (let i = 0; i < history.length; ++i) {
            let historyBtn = $('<button>');
            historyBtn.addClass('m-2');
            historyBtn.text(history[i]);
            searchHistory.append(historyBtn);
        }
        return;
    }
    history = []; // if there was no saved history, create an empty array to be filled
}

searchBtn.on('click', function() { // when the search button is pressed, search the city inputted by the user
    event.preventDefault();
    city = $('#city').val();
    getLocation();
});

unitsBtn.on('click', function() { // update users unit preference and update current data to reflect the change
    event.preventDefault();
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
});

searchHistory.on('click', function() { // if a previous search is clicked, load its information
    event.preventDefault();
    if (event.target.matches('button')) {
        city = event.target.textContent;
        getLocation();
    }
});