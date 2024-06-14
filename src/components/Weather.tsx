/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { FaStar } from "react-icons/fa6";

import ClearImage from "../assets/images/clear.png";
import CloudImage from "../assets/images/cloud.png";
import DrizzleImage from "../assets/images/drizzle.png";
import HumidityImage from "../assets/images/humidity.png";
import RainImage from "../assets/images/rain.png";
import SnowImage from "../assets/images/snow.png";
import WindImage from "../assets/images/wind.png";
import Search from "./Search";
import Forecast from "./Forecast";
import Favourite from "./Favourite";
import {
  addFavouriteCity,
  getFavouriteCities,
  removeFavouriteCity,
} from "../../util/http";

type WeatherData = {
  temperature: string;
  humidity: string;
  windSpeed: string;
};

type FavouriteCity = {
  id: string;
  city: string;
};

const getUniqueDates = (data: any): string[] => {
  const uniqueDateMap = new Map();

  data.forEach((forecast: any) => {
    const datePart = forecast.dt_txt.split(" ")[0];
    if (!uniqueDateMap.has(datePart)) {
      uniqueDateMap.set(datePart, forecast);
    }
  });

  return Array.from(uniqueDateMap.values());
};

const API_KEY = import.meta.env.VITE_WEATHER_FORECAST_API_KEY;

export default function Weather() {
  const searchLocationRef = useRef<HTMLInputElement>(null);
  const [cityName, setCityName] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [cityFound, setCityFound] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: "",
    humidity: "",
    windSpeed: "",
  });
  const [forecast, setForecast] = useState<any>([]);
  const [favouriteCities, setFavouriteCities] = useState<FavouriteCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getFavouriteCities();
      setFavouriteCities(cities);
    };
    fetchCities();
  }, []);

  const isFavouriteCity = favouriteCities?.find(
    (city: { city: string }) => city.city === cityName
  );

  const searchWeatherHandler = async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    const city = searchLocationRef!.current!.value;
    setCityName(city);
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=Metric&appid=${API_KEY}`
      );
      const responseData = await response.json();
      const forecastDates: any = getUniqueDates(responseData?.list);
      setForecast(forecastDates);
      setCityFound(true);
      setIsLoading(false);

      const data = {
        temperature: responseData?.list[0]?.main.temp,
        humidity: responseData?.list[0]?.main.humidity,
        windSpeed: responseData?.list[0]?.wind.speed,
      };
      if (responseData?.cod === "200") {
        setWeatherData(data);

        if (
          responseData?.list[0].weather[0].icon === "01d" ||
          responseData?.list[0].weather[0].icon === "01n"
        ) {
          setWeatherIcon(ClearImage);
        } else if (
          responseData?.list[0].weather[0].icon === "02d" ||
          responseData?.list[0].weather[0].icon === "02n"
        ) {
          setWeatherIcon(CloudImage);
        } else if (
          responseData?.list[0].weather[0].icon === "03d" ||
          responseData?.list[0].weather[0].icon === "03n" ||
          responseData?.list[0].weather[0].icon === "04d" ||
          responseData?.list[0].weather[0].icon === "04n"
        ) {
          setWeatherIcon(DrizzleImage);
        } else if (
          responseData?.list[0].weather[0].icon === "09d" ||
          responseData?.list[0].weather[0].icon === "09n" ||
          responseData?.list[0].weather[0].icon === "10d" ||
          responseData?.list[0].weather[0].icon === "10n"
        ) {
          setWeatherIcon(RainImage);
        } else if (
          responseData?.list[0].weather[0].icon === "13d" ||
          responseData?.list[0].weather[0].icon === "13n"
        ) {
          setWeatherIcon(SnowImage);
        } else {
          setWeatherIcon(ClearImage);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setCityFound(false);
      toast.error("City not found");
      console.error("Error fetching weather data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavourite = async () => {
    const newFavourite = {
      id: crypto.randomUUID(),
      city: cityName,
    };

    await addFavouriteCity(newFavourite);

    const updatedCities = await getFavouriteCities();
    setFavouriteCities(updatedCities);
  };

  const removeFavourite = async (id: string) => {
    await removeFavouriteCity(id);

    const updatedCities = await getFavouriteCities();
    setFavouriteCities(updatedCities);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="relative bg-gradient-to-b from-sky-300 to-blue-700 lg:min-w-[700px] max-w-max rounded-md p-8 text-center">
        {cityFound && (
          <FaStar
            size={30}
            className={`absolute right-7 top-9 cursor-pointer ${
              isFavouriteCity?.city ? "text-red-700" : "text-white"
            }`}
            onClick={
              isFavouriteCity?.city
                ? () => removeFavourite(isFavouriteCity?.id)
                : addFavourite
            }
          />
        )}
        <h1 className="text-sky-800 text-3xl font-semibold">Weather App</h1>
        <Search onSearch={searchWeatherHandler} searchRef={searchLocationRef} />
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
            </div>
          </div>
        )}
        {cityFound && !isLoading && (
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
            <Forecast data={forecast} />
          </div>
        )}
      </div>
      <Favourite
        favouriteCities={favouriteCities}
        searchRef={searchLocationRef}
        onSearchFavourite={searchWeatherHandler}
      />
    </div>
  );
}
