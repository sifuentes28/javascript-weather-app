const apiKey = "cf4e86de24e0c72162da3e282c821dad";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const upsplashApiKey = "YCoxbM42W5FbKb1PePzAOGT-L2dmUEqT5FaChdA0Y6M";
const unsplashApiUrl = "https://api.unsplash.com/search/photos?per_page=100&query=";
const searchBox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const tempToggle = document.getElementById('tempToggle');
let currentTempCelsius = null;  // Global variable to store the current temperature in Celsius

async function fetchCityImage(city){
    try{
        const response = await fetch(unsplashApiUrl + city + `&client_id=${upsplashApiKey}`);
        const imageData = await response.json();
        console.log('Unsplash API response:', imageData);
        if (imageData.results && imageData.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * imageData.results.length);
            const imageUrl = imageData.results[randomIndex].urls.regular;
            document.body.style.background = `url(${imageUrl}) no-repeat center center/cover`;
            document.body.style.animation = "none"; // takes animation off when image switches
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
        } else {
            console.error('No image found for the city');
        }
    } catch (error) {
        console.error('Error fetching city image:', error);
    }
}

async function checkWeather(city){
    try{
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
       
        if(response.status == 404){ // Added check to ensure API response is OK
            document.querySelector(".error").style.display = "block"; // display error message if error
            document.querySelector(".weather").style.display = "none";
            console.error("City not found");
        } else {
            var data = await response.json();
            console.log(data); // prints to console for debugging purposes and to see what is going on 
            // querySelector() selects html section/item by class name, innerHTML updates (changes) selected section
            document.querySelector(".city").innerHTML = data.name; 
            currentTempCelsius = data.main.temp;  // Store the temperature in Celsius
            updateTemperature(currentTempCelsius);  // Update the temperature display based on the toggle state
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";

            if(data.weather[0].main == "Clouds"){
                weatherIcon.src = "/clouds.png"; // changes the img, the .src means it updates the src
            } else if(data.weather[0].main == "Clear"){
                weatherIcon.src = "/clear.png";
            } else if(data.weather[0].main == "Rain"){
                weatherIcon.src = "/rain.png";
            } else if(data.weather[0].main == "Drizzle"){
                weatherIcon.src = "/drizzle.png";
            } else if(data.weather[0].main == "Mist"){
                weatherIcon.src = "/mist.png";
            }

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
        }
    } catch(error) {
        console.error('Error fetching weather data:', error); // Added error handling
    }
}

function updateTemperature(tempCelsius) {
    const tempElement = document.querySelector('.temp');
    if (tempToggle.checked) {
        // Convert Celsius to Fahrenheit
        let tempInFahrenheit = (tempCelsius * 9 / 5) + 32;
        tempElement.innerHTML = Math.round(tempInFahrenheit) + "°F";
    } else {
        // Display Celsius
        tempElement.innerHTML = Math.round(tempCelsius) + "°C";
    }
}

tempToggle.addEventListener('change', () => {
    if (currentTempCelsius !== null) { // Ensure currentTempCelsius is set before updating
        updateTemperature(currentTempCelsius);
    }
});

searchbtn.addEventListener("click", () => { // so when search btn is clicked it listens and does this function
    checkWeather(searchBox.value);  // this passes the value from search box into the function 
    fetchCityImage(searchBox.value);
});

 // Dragging functionality
 draggableCard.addEventListener('mousedown', function(e) {
    let offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
    let offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

    function mouseMoveHandler(e) {
        draggableCard.style.left = `${e.clientX - offsetX}px`;
        draggableCard.style.top = `${e.clientY - offsetY}px`;
    }

    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

});
