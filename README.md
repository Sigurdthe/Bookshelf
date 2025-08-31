My name is Oussama Lasfar, and I am an ALX Front-End Web Development student. This is the final update of my Capstone project. Over the past few weeks, I have worked on building the application and making it as clear and simple as possible. You will find a directory named bookfinder-app with 2 branches, which contains the initial milestones of the app. However, the latest version of the code exists outside the bookfinder-app directory. Why? Because Vercel cannot build an app located inside a nested directory. Vercel requires the application’s package to be directly inside the repository root. This is why the final version of the app is placed at the root for proper deployment.

CapstoneProject5/
├─ bookfinder-app       #Early developments and experimentation
│
├─ src/
│  ├─ App.jsx           # Main app component
│  ├─ index.jsx         # Entry point
│  ├─ index.css         # TailwindCSS + custom styles
│  ├─ store/            # Zustand store
│  │   └─ useBookStore.js
│  └─ components/       # (Optional) Separate reusable components
│
├─ public/              # Static files
├─ package.json
├─ tailwind.config.js
└─ README.md



# BookShelf 

BookShelf is a modern, responsive web application that allows users to **browse, search, and favourite books**. It integrates with the Google Books API to fetch book data and provides an intuitive, interactive interface for book lovers.  


**Slogan:** Strive for Knowledge

---

## Features

- **Browse Featured Books:** Discover popular books in different categories.
- **Search Books:** Search by title, author, or category using the Google Books API.
- **Favourites:** Add or remove books from your personal favourites list.
- **Dark Mode:** Toggle between light and dark themes.
- **Responsive Design:** Works seamlessly across mobile, tablet, and desktop devices.
- **Category Navigation:** Easily filter books by genres such as Fiction, Non-Fiction, Sci-Fi, Mystery, and History.
- **User-Friendly UI:** Includes interactive buttons, hover effects, and responsive grids.

---

## Demo

https://bookshelf-red.vercel.app/
https://www.loom.com/share/14b08988a43e4187a71064a6922b19bf?sid=ec0bc239-fec8-4f23-ac92-2115521ceb25

---

## Technologies Used

- **React** - Front-end library for building user interfaces  
- **TailwindCSS** - Utility-first CSS framework for styling  
- **Google Books API** - Fetching book data  
- **Lucide React** - Icons library  
- **Local Storage** - Persisting favourites and dark mode preferences  
- **Zustand** - State management library for global app state  
- **Vite** - Fast build tool and development server  

---

## Installation
1. **Clone the repository**
```bash
git clone https://github.com/Sigurdthe/CapstoneProject5.git
cd CapstoneProject5
npm install
npm run dev









