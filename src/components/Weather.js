import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api";
import * as moment from 'moment';
import 'moment/locale/pt-br';

export default function Weather() {
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [temp, setTemp] = useState('');

    const getWheaterInfo = useCallback(async () => {
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPosition);
            } else {
                Swal.fire("Seu navegador não suporta geolocalização", '', 'error');
            }
        }

        function setPosition(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const day = moment().format('D');
            const weatherCache = localStorage.getItem('weather');

            if (weatherCache !== null) {
                const weather = JSON.parse(weatherCache);
                if (weather.day === day) {
                    updateWeatherState(weather);
                    return;
                }
            }

            (async () => {
                const res = await api.get(`/weather`, {
                    params: { lat, lon }
                });

                if (res.data.results.time !== undefined) {
                    const { temp, city, description } = res.data.results;
                    saveWeather({ temp, city, description, day });
                    updateWeatherState({
                        temp,
                        description,
                        city
                    });
                }
            })()
        }

        getLocation();
    }, []);

    function updateWeatherState(weather) {
        setCity(weather.city);
        setDescription(weather.description);
        setTemp(weather.temp);
    }

    function saveWeather(weather) {
        // Criando cache das condições climáticas
        localStorage.setItem('weather', JSON.stringify(weather));
    }

    useEffect(() => {
        getWheaterInfo();
    }, [getWheaterInfo])

    const getDayOfWeek = () => {
        moment.locale('pt-br');
        const localLocale = moment();
        return localLocale.format('ddd');
    };

    const dayOfWeek = getDayOfWeek();

    return (
        (city ? (
            <div className="bg-dark-2 p-3 rounded text-white mb-3" >
                <small>
                    <h5 className="mb-1">{description}</h5>
                    <div>{temp}&deg;C {dayOfWeek} - {city}</div>
                </small>
            </div>
        ) : null
        )
    );
}