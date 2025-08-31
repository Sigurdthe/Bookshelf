import React, { useState, useEffect } from "react";
import { Search, Heart, Home, Moon, Sun, BookOpen } from "lucide-react";

// Owl logo image URL (replace with your own if needed)
const owlLogo = "https://cdn-icons-png.flaticon.com/512/616/616617.png";

const BookLibrary = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasSearched, setHasSearched] = useState(false);

  const categories = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Mystery", "History"];

  // Load favourites and dark mode from localStorage
  useEffect(() => {
    const savedFavourites = JSON.parse(localStorage.getItem("bookFavourites") || "[]");
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
    setFavourites(savedFavourites);
    setDarkMode(savedDarkMode);
    loadFeaturedBooks();
  }, []);

  useEffect(() => {
    localStorage.setItem("bookFavourites", JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const loadFeaturedBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=12`
      );

      if (response.ok) {
        const data = await response.json();
        const formattedBooks = data.items?.map((item) => ({
          id: item.id,
          title: item.volumeInfo?.title || "Unknown Title",
          authors: item.volumeInfo?.authors || ["Unknown Author"],
          description: item.volumeInfo?.description || "No description available",
          thumbnail:
            item.volumeInfo?.imageLinks?.thumbnail?.replace("http:", "https:") ||
            "https://via.placeholder.com/200x300/4f46e5/ffffff?text=No+Cover",
          publishedDate: item.volumeInfo?.publishedDate || "Unknown",
          categories: item.volumeInfo?.categories || ["General"],
          pageCount: item.volumeInfo?.pageCount || "Unknown",
          rating: item.volumeInfo?.averageRating || 0,
        })) || [];
        setBooks(formattedBooks);
      } else {
        throw new Error("API request failed");
      }
    } catch (err) {
      setError("Failed to load featured books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (query, category = "All") => {
    if (!query.trim() && category === "All") return;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      let searchTerm = query.trim();
      if (category !== "All") {
        searchTerm =
          category === "Non-Fiction" ? "subject:nonfiction" : `subject:${category.toLowerCase()}`;
        if (query.trim()) {
          searchTerm = `${query.trim()}+${searchTerm}`;
        }
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}&maxResults=20&orderBy=relevance`
      );

      if (response.ok) {
        const data = await response.json();
        const formattedBooks = data.items?.map((item) => ({
          id: item.id,
          title: item.volumeInfo?.title || "Unknown Title",
          authors: item.volumeInfo?.authors || ["Unknown Author"],
          description: item.volumeInfo?.description || "No description available",
          thumbnail:
            item.volumeInfo?.imageLinks?.thumbnail?.replace("http:", "https:") ||
            "https://via.placeholder.com/200x300/4f46e5/ffffff?text=No+Cover",
          publishedDate: item.volumeInfo?.publishedDate || "Unknown",
          categories: item.volumeInfo?.categories || ["General"],
          pageCount: item.volumeInfo?.pageCount || "Unknown",
          rating: item.volumeInfo?.averageRating || 0,
        })) || [];

        setBooks(formattedBooks);
      } else {
        throw new Error("Search failed");
      }
    } catch (err) {
      setError("Failed to search books. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchBooks(searchQuery, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== "All") {
      searchBooks("", category);
    } else {
      loadFeaturedBooks();
    }
  };

  const addToFavourites = (book) => {
    if (!favourites.find((item) => item.id === book.id)) {
      setFavourites([...favourites, book]);
    }
  };

  const removeFromFavourites = (bookId) => {
    setFavourites(favourites.filter((book) => book.id !== bookId));
  };

  const isInFavourites = (bookId) => {
    return favourites.some((book) => book.id === bookId);
  };

  const BookCard = ({ book, showRemove = false }) => (
    <div
      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="relative group">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x300/4f46e5/ffffff?text=No+Cover";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => (showRemove ? removeFromFavourites(book.id) : addToFavourites(book))}
            className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 rounded-full ${
              showRemove
                ? "bg-red-500 hover:bg-red-600"
                : isInFavourites(book.id)
                ? "bg-gray-500"
                : "bg-pink-500 hover:bg-pink-600"
            } text-white transform scale-90 group-hover:scale-100`}
          >
            <Heart className={`h-5 w-5 ${isInFavourites(book.id) ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3
          className={`font-bold text-lg mb-2 line-clamp-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {book.title}
        </h3>
        <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          By {book.authors.join(", ")}
        </p>
        <p className={`text-xs mb-3 line-clamp-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {book.description.length > 100 ? `${book.description.substring(0, 100)}...` : book.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {book.publishedDate?.split("-")[0]}
          </span>
          {book.rating > 0 && (
            <span className={`text-xs ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
              ⭐ {book.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="max-w-7xl mx-auto px-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-blue-500 text-white shadow-lg transform scale-105"
                : darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Section */}
      <div
        className={`rounded-2xl p-6 mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-xl`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-4 top-4 h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Search books by Title or Author"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-800 border-gray-200"
              } border`}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Books Grid */}
      <div>
        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
          {hasSearched
            ? "Search Results"
            : selectedCategory === "All"
            ? "Featured Books"
            : selectedCategory}
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-20 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
          >
            <BookOpen
              className={`h-20 w-20 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`}
            />
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              {hasSearched ? "No books found. Try a different search term." : "Loading featured books..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const FavouritesPage = () => (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        My Favourites ({favourites.length})
      </h2>

      {favourites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {favourites.map((book) => (
            <BookCard key={book.id} book={book} showRemove={true} />
          ))}
        </div>
      ) : (
        <div
          className={`text-center py-20 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <Heart className={`h-20 w-20 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-xl mb-2 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            Your favourites list is empty
          </p>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
            Discover amazing books and add them to your favourites!
          </p>
          <button
            onClick={() => setCurrentPage("home")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Discover Books
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <img src={owlLogo} alt="Owl Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className={`text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  BookShelf
                </h1>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Strive for Knowledge
                </p>
              </div>
            </div>

            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${darkMode ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setCurrentPage("home")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === "home"
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </button>

              <button
                onClick={() => setCurrentPage("favourites")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === "favourites"
                    ? "bg-pink-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Heart className={`h-4 w-4`} />
                <span className="font-medium">Favourites ({favourites.length})</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">{currentPage === "home" ? <HomePage /> : <FavouritesPage />}</main>
    </div>
  );
};

export default BookLibrary;
