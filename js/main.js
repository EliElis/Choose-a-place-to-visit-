const app = angular.module("weekendApp", []);
app.controller("defaultCtrl", function (localStrCity, getWeather) {
	var vm = this;
	vm.cityList = localStrCity.getCityInfo(); //service, gets info from local storage or default list
	vm.visitedCities = localStrCity.getCityStateInfo('visited');
	vm.interestingCities = localStrCity.getCityStateInfo('interesting');
	vm.cityObjects = [];
	//Function, which create a City object and add date	
	vm.createCityObjects = function () {
		vm.cityList.forEach(function (item, i) {
			let cityObj = {};
			let url = "http://api.openweathermap.org/data/2.5/weather?q=" + item + "&appid=8bfafb8abcfedfa66cf6fc6402896ca8";
			//For 'Pristina', 'Nicosia', 'Luxembourg' cannot get api by city name, so there are id in urls
			if (item == 'Pristina') {
				url = "http://api.openweathermap.org/data/2.5/weather?id=786714&appid=8bfafb8abcfedfa66cf6fc6402896ca8";
			}
			if (item == 'Nicosia') {
				url = "http://api.openweathermap.org/data/2.5/weather?id=146268&appid=8bfafb8abcfedfa66cf6fc6402896ca8";
			}
			if (item == 'Luxembourg (city)') {
				url = "http://api.openweathermap.org/data/2.5/weather?id=2960316&appid=8bfafb8abcfedfa66cf6fc6402896ca8";
			}
			cityObj.name = item;
			cityObj.id = i;
			cityObj = getWeather.getWeatherApi(url, cityObj); //service, gets info from api, returns object
			vm.cityObjects.push(cityObj);
		})
	}
	vm.createCityObjects();
	//Variable for modal form (ng-show)
	vm.showVar = false;
	vm.show = function () {
		vm.showVar = true;
	};
	vm.hide = function () {
		vm.showVar = false;
	};
	//Save function	
	vm.save = function (item) {
			let isInList = false;
			//checks if city is already in the list		
			vm.cityList.forEach(function (elem, i) {
				if (elem == item) {
					isInList = true;
					alert("This city is already in the list!");
					var inp = document.getElementById('formName');
					inp.value = "";
					vm.hide();
				}
			});
			if (isInList == false) {
				//adds city name in a list and to localstorage
				vm.cityList.push(item);
				localStrCity.saveToStorage(vm.cityList, "list");
				//creates object for the city
				let cityObj = {};
				cityObj.name = item;
				cityObj.status;
				cityObj.id = vm.cityList.length - 1;
				let url = "http://api.openweathermap.org/data/2.5/weather?q=" + item + "&appid=8bfafb8abcfedfa66cf6fc6402896ca8";
				cityObj = getWeather.getWeatherApi(url, cityObj);
				vm.cityObjects.push(cityObj);
				isInList = false;
				var inp = document.getElementById('formName');
				inp.value = "";
				vm.hide();
			}
		}
		//delete city
	vm.delete = function (obj) {
			let index = vm.cityObjects.indexOf(obj);
			vm.cityObjects.splice(index, 1);
			vm.cityList.splice(index, 1);
			localStrCity.saveToStorage(vm.cityList, "list");
		}
		//clear local storege and updates data on the page
	vm.toDefault = function () {
			localStorage.clear();
			vm.visitedCities = localStrCity.getCityStateInfo('visited');
			vm.interestingCities = localStrCity.getCityStateInfo('interesting');
			vm.cityList = localStrCity.getCityInfo();
			// console.log(vm.cityList);
			vm.cityObjects = [];
			console.log(vm.cityObjects);
			vm.createCityObjects();
			console.log(vm.cityObjects);
		}
		//push the city to array(visited or interesting) and local storage
	vm.asVisited = function (name) {
		vm.visitedCities.push(name);
		localStrCity.saveToStorage(vm.visitedCities, "visited");
		//console.log("visited " + name)
	}
	vm.asInteresting = function (name) {
			vm.interestingCities.push(name);
			localStrCity.saveToStorage(vm.interestingCities, "interesting");
			//console.log("interesting " + name)
		}
		//function for ng-class, choose color for city purple or gray  
	vm.cityColor = function (city) {
		if (vm.visitedCities.indexOf(city.name) != -1) {
			city.status = "Visited";
			return "visited";
		}
		else if (vm.interestingCities.indexOf(city.name) != -1) {
			city.status = "Going to visit";
			return "interesting";
		}
		else {
			city.status = "Neutral";
			return "usual";
		}
	}
	vm.orderVal = "temperature";
	//chooses a paramater for OrederBy filter
	vm.orderOnClick = function (x) {
			if (x != "temperature") {
				var element = document.getElementById("js-tbody");
				element.classList.remove("for-maxmin");
			}
			else {
				var element = document.getElementById("js-tbody");
				element.classList.add("for-maxmin");
			}
			vm.orderVal = x;
		}
		//diables buttons after status change  
	vm.disableButtons = function (city) {
		let status = vm.cityColor(city);
		if (status == "visited" || status == "interesting") {
			return true;
		}
		else {
			return false;
		}
	}
});