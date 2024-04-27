import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

import ClearImage from "../assets/images/clear.png";
import CloudImage from "../assets/images/cloud.png";
import DrizzleImage from "../assets/images/drizzle.png";
import HumidityImage from "../assets/images/humidity.png";
import RainImage from "../assets/images/rain.png";
import SnowImage from "../assets/images/snow.png";
import WindImage from "../assets/images/wind.png";

type WeatherData = {
  temperature: string;
  humidity: string;
  windSpeed: string;
};

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function Weather() {
  const searchLocationRef = useRef<HTMLInputElement>(null);
  const [cityName, setCityName] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: "",
    humidity: "",
    windSpeed: "",
  });

  const searchWeatherHandler = async (event: FormEvent) => {
    event.preventDefault();
    const city = searchLocationRef!.current!.value;
    setCityName(city);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${API_KEY}`
      );
      const responseData = await response.json();

      const data = {
        temperature: responseData?.main.temp,
        humidity: responseData?.main.humidity,
        windSpeed: responseData?.wind.speed,
      };
      console.log(responseData);
      if (responseData?.cod === 200) {
        setWeatherData(data);

        if (
          responseData?.weather[0].icon === "01d" ||
          responseData?.weather[0].icon === "01n"
        ) {
          setWeatherIcon(ClearImage);
        } else if (
          responseData?.weather[0].icon === "02d" ||
          responseData?.weather[0].icon === "02n"
        ) {
          setWeatherIcon(CloudImage);
        } else if (
          responseData?.weather[0].icon === "03d" ||
          responseData?.weather[0].icon === "03n" ||
          responseData?.weather[0].icon === "04d" ||
          responseData?.weather[0].icon === "04n"
        ) {
          setWeatherIcon(DrizzleImage);
        } else if (
          responseData?.weather[0].icon === "09d" ||
          responseData?.weather[0].icon === "09n" ||
          responseData?.weather[0].icon === "10d" ||
          responseData?.weather[0].icon === "10n"
        ) {
          setWeatherIcon(RainImage);
        } else if (
          responseData?.weather[0].icon === "13d" ||
          responseData?.weather[0].icon === "13n"
        ) {
          setWeatherIcon(SnowImage);
        } else {
          setWeatherIcon(ClearImage);
        }
      }
    } catch (error) {
      toast.error("City not found");
      console.error("Error fetching weather data: ", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-300 to-blue-700 w-[500px] rounded-md p-8 text-center">
      <h1 className="text-sky-800 text-3xl font-semibold">Weather App</h1>
      <form
        onSubmit={searchWeatherHandler}
        className="py-6 flex gap-2 justify-center"
      >
        <input
          type="text"
          ref={searchLocationRef}
          className="py-3 pl-6 pr-3 w-[70%] rounded-full bg-sky-200 outline-none"
        />
        <button
          type="submit"
          className="bg-sky-200 rounded-full w-12 h-12 flex justify-center items-center"
        >
          <FiSearch />
        </button>
      </form>
      {cityName?.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <img
              src={weatherIcon}
              alt="weather-icon"
              className="w-40 h-40 mx-auto"
            />
            {weatherData?.temperature && (
              <strong className="tracking-wider text-3xl text-rose-800">
                {weatherData.temperature} °c
              </strong>
            )}
            <h3 className="text-2xl tracking-wide text-center font-semi-bold text-sky-950">
              {cityName}
            </h3>
          </div>
          <div className="flex justify-around">
            <div className="flex gap-4 items-center">
              <div>
                <img src={HumidityImage} alt="humidity" className="w-8 h-8" />
              </div>
              <div>
                {weatherData?.humidity && (
                  <strong className="tracking-wider text-xl text-rose-800">
                    {weatherData.humidity} %
                  </strong>
                )}
                <p className="text-sm text-gray-800">Humidity</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div>
                <img src={WindImage} alt="wind" className="w-8 h-8" />
              </div>
              <div>
                {weatherData?.windSpeed && (
                  <strong className="tracking-wider text-xl text-rose-800">
                    {weatherData.windSpeed} km/hr
                  </strong>
                )}
                <p className="text-sm text-gray-800">Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
