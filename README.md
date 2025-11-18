# 🌍 GeoBlock Tester

Test your website's accessibility from 20+ countries instantly. Check geo-restrictions, CDN performance, and regional blocking for free.

## ✨ Features

- 🌐 Test from 20+ countries worldwide
- ⚡ Real-time parallel testing
- 🗺️ Interactive 3D globe visualization
- 📊 Detailed test results with load times
- 🔒 CDN and security analysis
- 📱 Fully responsive design
- 🆓 Free forever - No signup required

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 19.2** - UI Framework
- **Vite 7.2** - Build Tool
- **Tailwind CSS 4.1** - Styling
- **Globe.gl** - 3D Globe Visualization
- **Three.js** - WebGL Rendering

## 📁 Project Structure

```
iphub/
├── src/
│   ├── components/
│   │   ├── GeoBlockTester.jsx    # Test controls
│   │   ├── MapView.jsx            # 3D Globe
│   │   ├── TestResultsList.jsx   # Results panel
│   │   └── ErrorBoundary.jsx     # Error handling
│   ├── services/
│   │   └── geoblock.js           # Testing logic
│   ├── App.jsx                    # Main app
│   └── main.jsx                   # Entry point
├── public/
│   ├── globe.svg                  # Favicon
│   ├── robots.txt                 # SEO
│   └── sitemap.xml               # SEO
└── _headers                       # Cloudflare headers
```

## 🌍 Available Countries

US, UK, Germany, France, Japan, China, India, Brazil, Australia, Canada, Russia, Singapore, UAE, South Africa, Mexico, Spain, Italy, South Korea, Netherlands, Sweden

## 🚀 Deployment

This project is configured for deployment on **Cloudflare Pages**.

## 📄 License

MIT

## 👨‍💻 Author

**Huzaif Shaikh**

- GitHub: [@huzaifsk](https://github.com/huzaifsk)
- LinkedIn: [huzaif-shaikh](https://www.linkedin.com/in/huzaif-shaikh/)
- Twitter: [@Huzaif__Shaikh](https://x.com/Huzaif__Shaikh)
