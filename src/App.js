import React, { useState } from 'react';
import config from './config';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    const API_KEY = config.API_KEY;

    // Arka plan resimlerinin tanımlanması
    const backgroundImages = {
        // Kar ve karla ilgili durumlar
        "kar üfleme": 'url("/weather-backgrounds/snowy.jpg")',
        "sürüklenen kar": 'url("/weather-backgrounds/snowy.jpg")',
        "kar": 'url("/weather-backgrounds/snowy.jpg")',
        "kar sağanakları": 'url("/weather-backgrounds/snowy.jpg")',
        "yoğun kar": 'url("/weather-backgrounds/snowy.jpg")',
        "hafif kar": 'url("/weather-backgrounds/snowy.jpg")',
        "kar ve yağmur sağanakları": 'url("/weather-backgrounds/snowy.jpg")',
        "hafif yağmur ve kar": 'url("/weather-backgrounds/snowy.jpg")',
        "şiddetli yağmur ve kar": 'url("/weather-backgrounds/snowy.jpg")',

        // Çiseleme
        "çiseleme": 'url("/weather-backgrounds/rainy.jpg")',
        "şiddetli çiseleme": 'url("/weather-backgrounds/rainy.jpg")',
        "hafif çiseleme": 'url("/weather-backgrounds/rainy.jpg")',
        "hafif çiseleme/yağmur": 'url("/weather-backgrounds/rainy.jpg")',
        "şiddetli çiseleme/yağmur": 'url("/weather-backgrounds/rainy.jpg")',

        // Yağmur
        "yağmur": 'url("/weather-backgrounds/rainy.jpg")',
        "şiddetli yağmur": 'url("/weather-backgrounds/rainy.jpg")',
        "yoğun yağış": 'url("/weather-backgrounds/rainy.jpg")',
        "sağanak yağmur": 'url("/weather-backgrounds/rainy.jpg")',
        "hafif yağış": 'url("/weather-backgrounds/rainy.jpg")',
        "yağmur ve kar": 'url("/weather-backgrounds/rainy.jpg")',

        // Sis ve duman
        "sis": 'url("/weather-backgrounds/cloudy.jpg")',
        "duman veya pus": 'url("/weather-backgrounds/cloudy.jpg")',
        "dondurucu sis": 'url("/weather-backgrounds/cloudy.jpg")',

        // Fırtına ve kasırga
        "fırtına": 'url("/weather-backgrounds/cloudy.jpg")',
        "fırtınalar": 'url("/weather-backgrounds/cloudy.jpg")',
        "huni bulutu": 'url("/weather-backgrounds/cloudy.jpg")',
        "kasırga": 'url("/weather-backgrounds/cloudy.jpg")',

        // Diğer hava koşulları
        "toz fırtınası": 'url("/weather-backgrounds/default.jpg")',
        "bulutlu": 'url("/weather-backgrounds/cloudy.jpg")',
        "parçalı bulutlu": 'url("/weather-backgrounds/cloudy.jpg")',
        "açık": 'url("/weather-backgrounds/sunny.jpg")',
        "yıldırımsız yıldırım": 'url("/weather-backgrounds/cloudy.jpg")',
        "yoğun dondurucu çiseleme/dondurucu yağmur": 'url("/weather-backgrounds/snowy.jpg")',
        "hafif dondurucu çiseleme/dondurucu yağmur": 'url("/weather-backgrounds/snowy.jpg")',
        "şiddetli dondurucu yağmur": 'url("/weather-backgrounds/snowy.jpg")',
        "hafif dondurucu yağmur": 'url("/weather-backgrounds/snowy.jpg")',
        "çevrede yağış": 'url("/weather-backgrounds/rainy.jpg")',
        "buz": 'url("/weather-backgrounds/default.jpg")',
        "elmas tozu": 'url("/weather-backgrounds/default.jpg")',
        "dolu": 'url("/weather-backgrounds/default.jpg")',
        "gökyüzü kapsamı azalan": 'url("/weather-backgrounds/cloudy.jpg")',
        "gökyüzü kapsamı artan": 'url("/weather-backgrounds/cloudy.jpg")',
        "gökyüzü değişmedi": 'url("/weather-backgrounds/sunny.jpg")',
    };

    // Hava durumu koşuluna göre arka plan seçimi
    const getBackground = (condition) => {
        if (!condition) return backgroundImages["default"];

        condition = condition.toLowerCase();
        if (condition.includes('açık') || condition.includes('güneşli')) return backgroundImages["açık"];
        if (condition.includes('kar')) return backgroundImages["kar"];
        if (condition.includes('yağmur')) return backgroundImages["yağmur"];
        if (condition.includes('sis') || condition.includes('pus')) return backgroundImages["sis"];
        if (condition.includes('fırtına') || condition.includes('kasırga')) return backgroundImages["fırtına"];
        if (condition.includes('toz fırtınası')) return backgroundImages["toz fırtınası"];
        if (condition.includes('bulut')) return backgroundImages["bulutlu"];
        return backgroundImages["default"];
    };

    // Hava durumu verisini API'den çekme
    const getWeather = async () => {
        if (!city.trim()) {
            setError('Lütfen bir şehir adı girin');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json&lang=tr`
            );

            if (!response.ok) {
                throw new Error('Şehir bulunamadı');
            }

            const data = await response.json();
            setWeatherData(data);
        } catch (err) {
            setError('Hava durumu bilgisi alınamadı. Lütfen geçerli bir şehir adı girin.');
        } finally {
            setLoading(false);
        }
    };

    // 'Enter' tuşuna basıldığında hava durumu verisini al
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getWeather();
        }
    };

    return (
        <div
            className="min-vh-100 d-flex justify-content-center align-items-center py-5"
            style={{
                backgroundImage: weatherData
                    ? getBackground(weatherData.currentConditions?.conditions)
                    : backgroundImages.default,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transition: 'background-image 0.5s ease'
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                            <div className="card-body">
                                <h1 className="text-center mb-4">Hava Durumu</h1>

                                <div className="mb-4">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Şehir adı girin..."
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            onClick={getWeather}
                                            disabled={loading}
                                        >
                                            {loading ? 'Yükleniyor...' : 'Ara'}
                                        </button>
                                    </div>
                                    {error && <div className="text-danger mt-2 text-center">{error}</div>}
                                </div>

                                {weatherData && (
                                    <div className="weather-info">
                                        <h2 className="text-center mb-3">{weatherData.address}</h2>
                                        <div className="row text-center">
                                            <div className="col-md-4 mb-3">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h5>Sıcaklık</h5>
                                                        <p className="display-6">
                                                            {weatherData.currentConditions.temp}°C
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h5>Nem</h5>
                                                        <p className="display-6">
                                                            %{weatherData.currentConditions.humidity}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h5>Rüzgar Hızı</h5>
                                                        <p className="display-6">
                                                            {weatherData.currentConditions.windspeed} km/s
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="card h-100 text-center">
                                                    <div className="card-body">
                                                        <h5>Hava Olayı</h5>
                                                        <p className="display-6">
                                                            {weatherData.currentConditions.conditions}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <button
                                        className="btn btn-info"
                                        onClick={() => setShowAbout(!showAbout)}
                                    >
                                        Hakkında
                                    </button>
                                </div>

                                {showAbout && (
                                    <div className="mt-3 text-center">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5>Geliştirici</h5>
                                                <p>İsim: Semih Kartal</p>
                                                <a href="https://github.com/zhentilar/">GitHub: zhentilar</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;
