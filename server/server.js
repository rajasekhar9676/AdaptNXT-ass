const express = require('express');
const fetch = require('node-fetch');
const cors=require('cors')

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Information Service');
});

app.get('/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).send({ error: 'City is required' });
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`);
    const weatherData = await response.json();

    if (weatherData.cod !== "200") {
      return res.status(400).send({ error: weatherData.message });
    }

    res.send({
      city: weatherData.city.name,
      country: weatherData.city.country,
      list: weatherData.list.map(item => ({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        weather: item.weather[0].description,
        wind_speed: item.wind.speed,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
      }))
    });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching the weather data' });
  }
});

app.listen(port, () => {
  console.log(`Weather Information Service is running on http://localhost:${port}`);
});
