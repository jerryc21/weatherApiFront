import "bootstrap/dist/css/bootstrap.min.css"
import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App(){
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [bgColor, setBgColor] = useState('#F5F5DC'); 

  useEffect(() => {
    document.body.style.backgroundColor = bgColor; 
    return () => {
      document.body.style.backgroundColor = ''; 
    };
  }, [bgColor]); 

  const fetchWeather = async () => {
    const lat = latitudeRef.current.value;
    const lon = longitudeRef.current.value;

    if (!lat || !lon) {
      setError('Please enter both latitude and longitude.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/${lat},${lon}`);
      setWeatherData(response.data);
      setError(null);

      // Check for a condition in the response to set the background color
      if (response.data && response.data.categorizeTemp === "The weather outside is hot")  
        setBgColor('#ff3333'); 
      else if(response.data.categorizeTemp === "The weather outside is cold")
        setBgColor('#4d79ff'); 
      else {
        setBgColor('#F5F5DC'); // Reset to beige hex color
      }
    } catch (error) {
      setError(error.response.data);
      setWeatherData(null);
      setBgColor('#F5F5DC'); // Reset background color if there's an error
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Latitude"
        ref={latitudeRef}
        className="input"
      />
      <input
        type="text"
        placeholder="Longitude"
        ref={longitudeRef}
        className="input"
      />
      <button onClick={fetchWeather} className="button">
        Get Weather
      </button>

      {weatherData && (
        <div className="result">
          <h3>Weather Data:</h3>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </div>
      )}

      {error && <p className="error">{JSON.stringify(error,null,2)}</p>}
    </div>
  );
};
export default App;
