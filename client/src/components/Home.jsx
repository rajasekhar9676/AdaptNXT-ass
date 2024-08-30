import { useState, useEffect } from 'react';
import axios from 'axios';
import { RxCross1 } from "react-icons/rx";
import sunny from '../assets/sunny.png';
import partlycloudy from '../assets/partlycloudy.png';
import cloudy from '../assets/cloudy.png';
import rain from '../assets/rain.png';
import rainy from '../assets/rainy.png';
import snow from '../assets/snow.png';
import storm from '../assets/storm.png';
import fog from '../assets/fog.png';
import overcast from '../assets/overcast.png';
import './Home.css'; // Import the CSS file



function Home() {
  const [city, setCity] = useState('New York'); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3000/weather`, {
        params: { city },
      });

      setWeatherData({
        current: {
          temperature: response.data.list[0].temperature,
          description: response.data.list[0].weather,
          
        },
        forecast: response.data.list.slice(1, 6).map(item => ({
          day: new Date(item.datetime).toLocaleDateString('en-US', { weekday: 'short' }),
          high: item.temperature,
          low: item.temperature,
          
        })),
      });
    } catch (error) {
      setError('Please enter a valid city name...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(); // Perform search on mount
  }, [city]); // Dependency array includes city to re-fetch if city changes

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const handleClear = () => {
    setCity('');
  };

  return (
    <div className='home-container'>
      <div className='home-content'>
        <div className="weather-dashboard">
          <h1 className="dashboard-title">Weather Dashboard</h1>
          <div className="input-section">
            <div className='input-container'>
              <input
                type="text"
                className="city-input"
                placeholder="Enter city name..."
                value={city}
                onChange={handleCityChange}
              />
              {city && <RxCross1 className='clear-icon' onClick={handleClear} />}
            </div>
            <div className='button-container'>
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
              <button className="unit-toggle-button" onClick={toggleUnit}>
                {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
              </button>
            </div>
          </div>
          {loading ? (
            <div className="loading-message">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            weatherData && (
              <>
                <div className="current-weather">
                  <h2 className="current-title">Current Weather in {city}</h2>
                  <div className="current-details">
                    <span className="temperature">{weatherData.current.temperature}°{unit === 'metric' ? 'C' : 'F'}</span>
                    {/* <img src={weatherData.current.icon} alt={weatherData.current.description} className="weather-icon" /> */}
                  </div>
                  <p className="weather-description">{weatherData.current.description}</p>
                </div>
                <h2 className="forecast-title">5-Day Forecast</h2>
                <div className="forecast-grid">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                      <h3 className="forecast-day-name">{day.day}</h3>
                      <div className="forecast-details">
                        <span className="forecast-temp">{day.high}°{unit === 'metric' ? 'C' : 'F'}</span>
                        {/* <img src={day.icon} alt={day.description} className="forecast-icon" /> */}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
