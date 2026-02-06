import readline from "node:readline/promises";
import dotenv from "dotenv";
dotenv.config();
const ApiKey=process.env.ApiKey;
const ipUrl=process.env.ipUrl;
const weatherBaseUrl=process.env.weatherUrl;
console.log(ApiKey);

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});




const choice=(await rl.question("If you want your Current Locations weather enter C . If you want weather detail of Custom location enter R \n")).toUpperCase();

if(choice=='C'){
    const currentLocation=await getCurrentLocation();
       
    const latitude= currentLocation.lat;
    const longitude=currentLocation.lon;
    const location=`${latitude},${longitude}`;
    console.log("Fetching weather data...");
    await fetch_weather_data(location);
    console.log('Done');
    
}
else if(choice=='R'){
    const location=await rl.question('please enter the city name: \n');
    console.log("Fetching weather data...");
    await fetch_weather_data(location);
    console.log('Done');
}
else{
    console.log("Sorry we cannot proceed with your request");
}
rl.close();

async function fetch_weather_data(location){
    try{
        const response = await fetch(`${weatherBaseUrl}/current.json?key=${ApiKey}&q=${location}&aqi=yes`); 
        if(!response.ok){
            console.log("API resquest Failed")
        }
        const data=await response.json();
        console.log()
        console.log(`Weather report of ${data.location.name}`);
        console.log(`temprature ${data.current.temp_c} C`);
        console.log(`weather ${data.current.condition.text}`);

    }
    catch(error){
        console.log("something went wrong pls try again later");
        console.log(error);
    }
    
}

async function getCurrentLocation(){
    
    const response= await fetch(`${ipUrl}`);
    const data= await response.json();
    return data;

}



