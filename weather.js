// =====================================================
// 🎓 УРОК: РАБОТА С API (fetch)
// =====================================================
//
// API = Application Programming Interface
// Это "мост" между твоим приложением и данными на сервере.
//
// fetch() — встроенная функция JavaScript для HTTP-запросов.
// Она возвращает Promise — "обещание" что данные придут.
//
// =====================================================

// ===== КОНФИГУРАЦИЯ API =====
// 
// Мы используем бесплатный API: wttr.in
// Он не требует регистрации и ключа!
// Формат: https://wttr.in/Город?format=j1
// 
// Альтернатива: OpenWeatherMap (требует ключ API)

const API_BASE = 'https://wttr.in';


// ===== НАХОДИМ ЭЛЕМЕНТЫ =====

const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const weatherCard = document.getElementById('weatherCard');

// Элементы для данных
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feelsLike');


// ===== ФУНКЦИЯ ПОЛУЧЕНИЯ ПОГОДЫ =====
// 
// async/await — современный способ работы с асинхронным кодом
// async — говорит что функция асинхронная (может ждать)
// await — ждёт пока Promise выполнится

async function getWeather(city) {
    // 1. Показываем загрузку, скрываем остальное
    showLoading(true);
    hideError();
    hideWeather();

    try {
        // 2. Делаем запрос к API
        //    fetch() возвращает Promise
        //    await ждёт ответа от сервера

        const url = `${API_BASE}/${encodeURIComponent(city)}?format=j1`;
        console.log('🌐 Запрос к:', url);

        const response = await fetch(url);

        // 3. Проверяем успешность запроса
        if (!response.ok) {
            throw new Error('Город не найден');
        }

        // 4. Преобразуем ответ в JSON
        //    JSON = JavaScript Object Notation (формат данных)
        const data = await response.json();
        console.log('📦 Данные от API:', data);

        // 5. Проверяем что данные есть
        if (!data.current_condition || !data.current_condition[0]) {
            throw new Error('Нет данных о погоде');
        }

        // 6. Отображаем погоду
        displayWeather(data);

    } catch (err) {
        // Если ошибка — показываем сообщение
        console.error('❌ Ошибка:', err);
        showError(err.message || 'Не удалось получить погоду');
    } finally {
        // В любом случае скрываем загрузку
        showLoading(false);
    }
}


// ===== ФУНКЦИЯ ОТОБРАЖЕНИЯ ПОГОДЫ =====

function displayWeather(data) {
    // Извлекаем данные из ответа API
    const current = data.current_condition[0];
    const location = data.nearest_area[0];

    // Заполняем карточку
    cityName.textContent = location.areaName[0].value;
    country.textContent = location.country[0].value;

    // Температура
    const tempValue = parseInt(current.temp_C);
    temp.textContent = tempValue > 0 ? `+${tempValue}` : tempValue;

    // Описание погоды (на русском если есть, иначе английский)
    const weatherDesc = current.lang_ru?.[0]?.value || current.weatherDesc[0].value;
    description.textContent = weatherDesc;

    // Иконка в зависимости от погоды
    weatherIcon.textContent = getWeatherEmoji(current.weatherCode);

    // Детали
    wind.textContent = `${current.windspeedKmph} км/ч`;
    humidity.textContent = `${current.humidity}%`;

    const feelsTemp = parseInt(current.FeelsLikeC);
    feelsLike.textContent = feelsTemp > 0 ? `+${feelsTemp}°C` : `${feelsTemp}°C`;

    // Показываем карточку
    showWeather();

    // Получаем время намаза для этого города
    // Координаты из wttr.in хранятся в массиве
    const lat = location.latitude?.[0]?.value || location.latitude;
    const lon = location.longitude?.[0]?.value || location.longitude;
    if (lat && lon) {
        getPrayerTimes(lat, lon);
    }
}


// ===== ФУНКЦИЯ ВЫБОРА ЭМОДЗИ ПО КОДУ ПОГОДЫ =====

function getWeatherEmoji(code) {
    // Коды погоды wttr.in
    const weatherCodes = {
        '113': '☀️',  // Солнечно
        '116': '⛅',  // Частично облачно
        '119': '☁️',  // Облачно
        '122': '☁️',  // Пасмурно
        '143': '🌫️',  // Туман
        '176': '🌧️',  // Местами дождь
        '179': '🌨️',  // Местами снег
        '182': '🌧️',  // Мокрый снег
        '185': '🌧️',  // Морось
        '200': '⛈️',  // Гроза
        '227': '❄️',  // Метель
        '230': '❄️',  // Снежная буря
        '248': '🌫️',  // Туман
        '260': '🌫️',  // Ледяной туман
        '263': '🌧️',  // Морось
        '266': '🌧️',  // Легкий дождь
        '281': '🌧️',  // Ледяной дождь
        '284': '🌧️',  // Ледяной дождь
        '293': '🌧️',  // Легкий дождь
        '296': '🌧️',  // Дождь
        '299': '🌧️',  // Сильный дождь
        '302': '🌧️',  // Сильный дождь
        '305': '🌧️',  // Ливень
        '308': '🌧️',  // Сильный ливень
        '311': '🌧️',  // Ледяной дождь
        '314': '🌧️',  // Ледяной дождь
        '317': '🌨️',  // Мокрый снег
        '320': '🌨️',  // Мокрый снег
        '323': '🌨️',  // Легкий снег
        '326': '🌨️',  // Легкий снег
        '329': '❄️',  // Снег
        '332': '❄️',  // Снег
        '335': '❄️',  // Сильный снег
        '338': '❄️',  // Сильный снег
        '350': '🌧️',  // Град
        '353': '🌧️',  // Ливень
        '356': '🌧️',  // Сильный ливень
        '359': '🌧️',  // Очень сильный ливень
        '362': '🌨️',  // Мокрый снег
        '365': '🌨️',  // Мокрый снег
        '368': '🌨️',  // Снег
        '371': '❄️',  // Сильный снег
        '374': '🌧️',  // Град
        '377': '🌧️',  // Град
        '386': '⛈️',  // Гроза
        '389': '⛈️',  // Гроза с дождём
        '392': '⛈️',  // Гроза со снегом
        '395': '⛈️',  // Сильная гроза
    };

    return weatherCodes[code] || '🌡️';
}


// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showWeather() {
    weatherCard.classList.remove('hidden');
}

function hideWeather() {
    weatherCard.classList.add('hidden');
}


// ===== ВРЕМЯ НАМАЗА =====
// 
// API: Aladhan (https://aladhan.com/prayer-times-api)
// Бесплатный, не требует ключа
// Возвращает время молитв на основе координат

const prayerCard = document.getElementById('prayerCard');

async function getPrayerTimes(lat, lon) {
    try {
        // Формируем URL с координатами
        // method=2 = Islamic Society of North America (популярный метод расчёта)
        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=2`;
        console.log('🕌 Запрос времени намаза:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Не удалось получить время намаза');
        }

        const data = await response.json();
        console.log('📦 Данные намаза:', data);

        if (data.code === 200 && data.data && data.data.timings) {
            displayPrayerTimes(data.data.timings);
        }

    } catch (err) {
        console.error('❌ Ошибка получения времени намаза:', err);
        // Не показываем ошибку пользователю, просто скрываем карточку
        prayerCard.classList.add('hidden');
    }
}

function displayPrayerTimes(timings) {
    // Заполняем время молитв
    document.getElementById('fajr').textContent = timings.Fajr;
    document.getElementById('sunrise').textContent = timings.Sunrise;
    document.getElementById('dhuhr').textContent = timings.Dhuhr;
    document.getElementById('asr').textContent = timings.Asr;
    document.getElementById('maghrib').textContent = timings.Maghrib;
    document.getElementById('isha').textContent = timings.Isha;

    // Показываем карточку
    prayerCard.classList.remove('hidden');
}


// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

// Отправка формы
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Клик по кнопкам быстрых городов
document.querySelectorAll('.city-btn').forEach(button => {
    button.addEventListener('click', function () {
        const city = this.dataset.city;
        cityInput.value = city;
        getWeather(city);
    });
});


// ===== АВТОЗАГРУЗКА =====
// При загрузке страницы показываем погоду в Москве
getWeather('Moscow');


// ===== ГЕОЛОКАЦИЯ =====
// 
// navigator.geolocation — встроенный API браузера
// Запрашивает разрешение пользователя и возвращает координаты

const geoButton = document.getElementById('geoButton');

// Функция получения погоды по координатам
async function getWeatherByCoords(lat, lon) {
    showLoading(true);
    hideError();
    hideWeather();

    try {
        // wttr.in принимает координаты в формате: lat,lon
        const url = `${API_BASE}/${lat},${lon}?format=j1`;
        console.log('📍 Запрос по координатам:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Не удалось получить погоду');
        }

        const data = await response.json();
        console.log('📦 Данные:', data);

        if (!data.current_condition || !data.current_condition[0]) {
            throw new Error('Нет данных о погоде');
        }

        displayWeather(data);

    } catch (err) {
        console.error('❌ Ошибка:', err);
        showError(err.message);
    } finally {
        showLoading(false);
    }
}

// Функция определения местоположения
function getMyLocation() {
    // Проверяем поддержку геолокации
    if (!navigator.geolocation) {
        showError('Геолокация не поддерживается вашим браузером');
        return;
    }

    // Меняем кнопку на "загрузка"
    geoButton.textContent = '⏳';
    geoButton.disabled = true;

    // Запрашиваем координаты
    navigator.geolocation.getCurrentPosition(
        // Успех — получили координаты
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log('📍 Координаты:', lat, lon);

            // Получаем погоду по координатам
            getWeatherByCoords(lat, lon);

            // Возвращаем кнопку
            geoButton.textContent = '📍';
            geoButton.disabled = false;
        },
        // Ошибка — пользователь отказал или проблема
        function (error) {
            console.error('❌ Ошибка геолокации:', error);

            let message = 'Не удалось определить местоположение';
            if (error.code === 1) {
                message = 'Вы отклонили запрос на местоположение';
            } else if (error.code === 2) {
                message = 'Местоположение недоступно';
            } else if (error.code === 3) {
                message = 'Превышено время ожидания';
            }

            showError(message);

            // Возвращаем кнопку
            geoButton.textContent = '📍';
            geoButton.disabled = false;
        }
    );
}

// Обработчик клика на кнопку геолокации
geoButton.addEventListener('click', getMyLocation);


// =====================================================
// 🎓 ШПАРГАЛКА ПО FETCH И API:
// =====================================================
//
// FETCH (базовый синтаксис):
//   fetch(url)
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.log(error))
//
// ASYNC/AWAIT (современный синтаксис):
//   async function getData() {
//     const response = await fetch(url);
//     const data = await response.json();
//     return data;
//   }
//
// RESPONSE МЕТОДЫ:
//   response.json()  — получить данные как JSON объект
//   response.text()  — получить как текст
//   response.blob()  — получить как файл (картинка и т.д.)
//
// ОБРАБОТКА ОШИБОК:
//   try {
//     // код который может вызвать ошибку
//   } catch (error) {
//     // обработка ошибки
//   } finally {
//     // выполнится в любом случае
//   }
//
// ПОПУЛЯРНЫЕ БЕСПЛАТНЫЕ API:
//   wttr.in           — погода (без ключа)
//   jsonplaceholder   — тестовые данные
//   pokeapi.co        — покемоны
//   catfact.ninja     — факты о котах
//   api.github.com    — данные GitHub
//
// =====================================================
