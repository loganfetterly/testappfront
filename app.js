/* Global Variables */
const base_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=747676b2a816f589b7df1a28d0a53dbb'

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

/* Function called by event listener */
function performAction() {
	const zipCode = document.getElementById('zip').value;
	const content = document.getElementById('feelings').value;

	retrieveWeatherData(base_URL, zipCode, apiKey)
		.then(function (data) {
			console.log(data.main.temp + "TEmp");
			postData('https://guarded-eyrie-82721.herokuapp.com/saveData', {
				temp: data.main.temp,
				date: newDate,
				userResponse: content
			});
		})
		.then(function () {
			getData("https://guarded-eyrie-82721.herokuapp.com/getRecentWeatherData")
				.then(function (data) {
					console.log(data + 'data');
					try {
						document.getElementById('temp').innerHTML = data.temperature;
						document.getElementById('date').innerHTML = data.date;
						document.getElementById('content').innerHTML = data.userResponse;
						console.log(data);
					} catch (error) {
						console.log("There is some error in getting the data -> " + error);
					}
				})
		});
};


const retrieveWeatherData = async(base_URL, zipCode, apiKey) => {
	const res = await fetch(base_URL + zipCode + apiKey);
	try {
		// Transform response into JSON
		const data = await res.json()
		console.log(data);
		return data;
	} catch (error) {
		console.log("Could not retrieve Weather Data", error);
	}
}

//Function to POST the data
const postData = async(url = '', data = {}) => {
	console.log(data);
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});

	try {
		const newData = await response.json();
		console.log(newData);
		return newData;
	} catch (error) {
		console.log("error", error);
		// appropriately handle the error
	}
}

//Function to GET the data
const getData = async(url = '') => {

	const response = await fetch(url, {
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	try {
		const newData = await response.json();
		return newData;
	} catch (error) {
		console.log("GetData Error", error);
	}
}