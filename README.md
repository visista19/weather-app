# weather-app
# 🌤 Weather App - Visista Varshe

[![React](https://img.shields.io/badge/React-17.0.2-blue?logo=react)](https://reactjs.org/) 
[![Node.js](https://img.shields.io/badge/Node.js-18.16-green?logo=node.js)](https://nodejs.org/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0.6-brightgreen?logo=mongodb)](https://www.mongodb.com/)

A full-stack weather application that allows users to check **current weather** and **5-day forecasts** for any location, including their **current GPS location**. Users can also **export weather readings in CSV** and view info about **Product Manager Accelerator**.  

---

🛠 Features

- ✅ Enter location (City, Zip code, GPS coordinates) to get weather.  
- ✅ View 5-day forecast.  
- ✅ Fetch weather using current GPS location.  
- ✅ Export weather data as CSV.  
- ✅ Info button linking to [Product Manager Accelerator LinkedIn](https://www.linkedin.com/company/product-manager-accelerator/).  
- ✅ Colorful and easy-to-read UI.  

---

💻 Tech Stack

- **Frontend:** React, Axios  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Weather API:** OpenWeatherMap  
- **Other libraries:** json2csv (CSV export), date-fns  

---

## ⚡ Setup Instructions
 1️⃣ Clone the Repository
bash
git clone <your-repo-URL>
cd weather-app
2️⃣ Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env to add your MongoDB connection string if needed
npm start


Backend runs on: http://localhost:5000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs on: http://localhost:3000

🚀 How to Use
Enter a city, zip code, or GPS coordinates in the input field.
Click Get Weather or Use My Location.
View current weather and 5-day forecast.
Click 📥 Export CSV to download your weather readings.
Click ℹ️ Info to view the PMA LinkedIn page.

📝 Notes
Only stores the latest 100 requests in MongoDB for demo purposes.
Forecast limited to 6 days due to API restrictions.

👤 Author

Visista Varshe
