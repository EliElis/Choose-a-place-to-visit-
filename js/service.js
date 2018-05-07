app.factory('localStrCity', function () {
	const cityListDefault = ['Tirana', 'Andorra la Vella', 'Yerevan', 'Vienna', 'Baku', 'Minsk', 'Brussels', 'Sarajevo', 'Sofia', 'Zagreb', 'Prague', 'Copenhagen', 'Tallinn', 'Helsinki', 'Paris', 'Tbilisi', 'Berlin', 'Athens', 'Budapest', 'Reykjavik', 'Dublin', 'Rome', 'Astana', 'Riga', 'Vaduz', 'Vilnius', 'Luxembourg', 'Skopje', 'Valletta', 'Chisinau', 'Monaco', 'Podgorica', 'Amsterdam', 'Oslo', 'Warsaw', 'Lisbon', 'Bucharest', 'Moscow', 'San Marino', 'Belgrade', 'Bratislava', 'Ljubljana', 'Madrid', 'Stockholm', 'Bern', 'Ankara', 'Kyiv', 'London', 'Vatican City', 'Pristina', 'Nicosia', 'Luxembourg (city)'];
	//'Pristina', 'Nicosia', 'Luxembourg' //Cannot get by city name
	return {
		saveToStorage: function (elem, keyName) {
			localStorage.setItem(keyName, JSON.stringify(elem));
		}
		, getCityInfo: function () {
			let checkStorage = JSON.parse(localStorage.getItem('list'));
			if (checkStorage == null) {
				return cityListDefault;
			}
			else {
				return checkStorage;
			}
		}
		, getCityStateInfo: function (keyName) {
			let checkStorage = JSON.parse(localStorage.getItem(keyName));
			if (checkStorage == null) {
				return [];
			}
			else {
				return checkStorage;
			}
		}
	}
});
//gets info from weather api 
app.factory('getWeather', function ($http, $sce) {
	return {
		getWeatherApi: function (url, cityObj) { //Get data from weather API 
			let trustedUrl = $sce.trustAsResourceUrl(url);
			$http.jsonp(trustedUrl, {
				jsonpCallbackParam: 'callback'
			}).then(function (data) {
				let currentData = data.data;
				cityObj.temperature = Math.round(currentData.main.temp - 273.15); //Kelvin to Celsius
				cityObj.weather = currentData.weather[0].main;
				cityObj.icon = "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png";
			}).catch(function (response) {
				// console.error('Catch error', response.status, response.data);
				cityObj.temperature = "No info";
				cityObj.weather = "No info";
				cityObj.icon = "";
			})
			return (cityObj);
		}
	}
})