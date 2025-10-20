# MyDramaList Scraping API

An API to retrieve information about Asian dramas from the MyDramaList website.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This API allows you to search and retrieve detailed information about Asian dramas from the MyDramaList website, including details such as cast, recommendations, and reviews. The API uses web scraping to extract data directly from the site.

## ✨ Features

- Search dramas by title
- Get complete drama details
- Get specific cast information
- Get specific recommendations
- Get specific reviews
- Interactive documentation with Swagger

## 🛠️ Technologies

- Node.js
- Express.js
- Puppeteer (for web scraping)
- Cheerio (for HTML parsing)
- Swagger (for API documentation)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mdl-scrapping.git
   cd mdl-scrapping
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 🚀 Usage

After starting the server, the API will be available at `http://localhost:3000`.

Example usage with curl:

```bash
# Search dramas
curl -X GET "http://localhost:3000/api/dramas/search?query=goblin"

# Get drama details
curl -X GET "http://localhost:3000/api/dramas/16653"

# Get only cast information
curl -X GET "http://localhost:3000/api/dramas/16653/cast"
```

Example usage with JavaScript:

```javascript
// Search dramas
fetch('http://localhost:3000/api/dramas/search?query=goblin')
  .then(response => response.json())
  .then(data => console.log(data));

// Get drama details
fetch('http://localhost:3000/api/dramas/16653')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 📚 API Endpoints

### Search Dramas

- **GET** `/api/dramas/search?query={term}`
  - Search dramas by title
  - Parameters:
    - `query` (required): Search term

### Drama Details

- **GET** `/api/dramas/{id}`
  - Get complete details of a drama
  - Parameters:
    - `id` (required): Drama ID
    - `cast` (optional): Include cast information (true/false)
    - `recommendations` (optional): Include recommendations (true/false)
    - `reviews` (optional): Include reviews (true/false)

### Cast

- **GET** `/api/dramas/{id}/cast`
  - Get only cast information of a drama
  - Parameters:
    - `id` (required): Drama ID

### Recommendations

- **GET** `/api/dramas/{id}/recommendations`
  - Get only recommendations of a drama
  - Parameters:
    - `id` (required): Drama ID

### Reviews

- **GET** `/api/dramas/{id}/reviews`
  - Get only reviews of a drama
  - Parameters:
    - `id` (required): Drama ID

## 📖 Documentation

Interactive API documentation is available at `http://localhost:3000/api-docs` after starting the server. The documentation is automatically generated using Swagger and allows you to test the endpoints directly from your browser.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐️ Developed with ❤️ by [Gean Pedro](https://github.com/HimAndRobot) 
