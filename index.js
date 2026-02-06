import readline from "node:readline/promises";
import dotenv from "dotenv";

dotenv.config();
const ApiKey = process.env.ApiKey;
const ipUrl = process.env.ipUrl;
const weatherBaseUrl = process.env.weatherUrl;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const choice = (await rl.question("If you want your Current Locations weather enter C . If you want weather detail of Custom location enter R \n")).toUpperCase();

if (choice == 'C') {
    const currentLocation = await getCurrentLocation();

    const latitude = currentLocation.lat;
    const longitude = currentLocation.lon;
    const location = `${latitude},${longitude}`;
    console.log("Fetching weather data...");
    await fetch_weather_data(location);
    console.log('Done');

}
else if (choice == 'R') {
    const location = await rl.question('please enter the city name: \n');
    console.log("Fetching weather data...");
    await fetch_weather_data(location);
    console.log('Done');
}
else {
    console.log("Sorry we cannot proceed with your request");
}
rl.close();

async function fetch_weather_data(location) {
    try {
        const response = await fetch(`${weatherBaseUrl}/current.json?key=${ApiKey}&q=${location}&aqi=yes`);
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error("Invalid location. Please enter a valid city name.");
            }
            if (response.status === 401) {
                throw new Error("Invalid API key. Check your .env file.");
            }
            if (response.status === 403) {
                throw new Error("API access denied or rate limit exceeded.");
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const current_data = data.current;
        console.log(`Weather report of ${data.location.name}`);
        console.log(`temprature ${current_data.temp_c} C`);
        console.log(`weather ${current_data.condition.text}`);
        console.log(`Feels like ${current_data.feelslike_c} °C`);


    }
    catch (error) {
        console.log(`something went wrong ${error}`);
    }

}

async function getCurrentLocation() {

    const response = await fetch(`${ipUrl}`);
    const data = await response.json();
    return data;

}



