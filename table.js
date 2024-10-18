document.addEventListener("DOMContentLoaded", function() {
    const apikey = 'e8bec2ceb484daf01e8fabb41578b90d'; 
    const geminiApiKey = 'AIzaSyBXqdKU8yFpUsAgvn3aggVkJu-f7sWbc0w';
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city') || 'islamabad'; 
    document.getElementById('cityInput').value = city;

    // Chatbot greeting message
    const messagesContainer = document.getElementById('messages');
    const greetingMessageElement = document.createElement('div');
    greetingMessageElement.classList.add('message', 'chatbot-message');
    greetingMessageElement.textContent = "Hello dear! How may I help you today? Ask me about the weather!";
    messagesContainer.appendChild(greetingMessageElement);
    fetchWeatherData(city);

    // Function to fetch weather data
    function fetchWeatherData(city) {
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;
        
        fetch(forecastApiUrl)
            .then(response => {
                if (!response.ok) {
                    console.error(`OpenWeather API Error: ${response.status} - ${response.statusText}`);
                    throw new Error(`City not found: ${city}`);
                }
                return response.json();
            })
            .then(data => {
                const forecastTable = document.getElementById('forecastTable').getElementsByTagName('tbody')[0];
                forecastTable.innerHTML = '';
                const forecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

                if (forecasts.length === 0) {
                    // No forecasts found, inform the user
                    displayChatbotMessage("No weather data available for the specified city.");
                    forecastTable.innerHTML = '<tr><td colspan="3">No data available for the specified city.</td></tr>';
                    return;
                }

                forecasts.forEach(forecast => {
                    const row = forecastTable.insertRow();
                    row.insertCell(0).textContent = new Date(forecast.dt_txt).toLocaleDateString();
                    row.insertCell(1).textContent = `${forecast.main.temp}°C`;
                    row.insertCell(2).textContent = forecast.weather[0].description;
                });
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                displayChatbotMessage("I couldn't retrieve weather data. Please check the city name and try again.");
            });
    }

    // Function to send messages and handle user input in the chatbot
    function sendMessage() {
        const inputField = document.getElementById('chatInput');
        const userMessage = inputField.value.trim();
        
        if (userMessage) {            
            displayUserMessage(userMessage);

            
            if (userMessage.toLowerCase().includes('weather')) {
                const cityMatch = userMessage.match(/in (.+)/i); 
                const cityName = cityMatch ? cityMatch[1].trim() : null; 

                if (cityName) {
                    fetchWeatherData(cityName);  
                    displayChatbotMessage(`Fetching weather data for ${cityName}...`);
                } else {
                    displayChatbotMessage("Please specify a city, like 'What's the weather in Paris?'");
                }
            } else {
                fetchGeminiResponse(userMessage);
            }

            inputField.value = ''; 
            messagesContainer.scrollTop = messagesContainer.scrollHeight; 
        }
    }
    

    // Function to fetch data from the Gemini API based on user input
    function fetchGeminiResponse(userMessage) {
        const geminiApiUrl = `https://www.googleapis.com/customsearch/v1?q=weather+${city}&key=${geminiApiKey}&cx=geminiApiKey`;

        fetch(geminiApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${geminiApiKey}` 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gemini API Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const responseMessage = `Here's some info from Gemini based on your query: ${data.someField}`; 
            displayChatbotMessage(responseMessage);
        })
        .catch(error => {
            console.error('Error fetching data from Gemini:', error);
            displayChatbotMessage("I'm sorry, I couldn't retrieve data from the Gemini API.");
        });
    }

    // Function to display user messages
    function displayUserMessage(message) {
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.textContent = message;
        messagesContainer.appendChild(userMessageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; 
    }

    // Function to display chatbot messages
    function displayChatbotMessage(message) {
        const chatbotMessageElement = document.createElement('div');
        chatbotMessageElement.classList.add('message', 'chatbot-message');
        chatbotMessageElement.textContent = message;
        messagesContainer.appendChild(chatbotMessageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; 
    }

    document.getElementById('sendButton').addEventListener('click', sendMessage);

    document.getElementById('chatInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
