import React, { useState, useEffect } from 'react';
import { Search, Heart, BookOpen, Feather, User, Calendar, Palette, Moon, Sun } from 'lucide-react';

const BookFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme configurations
  const themes = {
    blue: {
      name: 'Ocean Blue',
      primary: 'blue',
      gradient: 'from-blue-600 to-indigo-600',
      accent: 'blue-50'
    },
    purple: {
      name: 'Royal Purple',
      primary: 'purple',
      gradient: 'from-purple-600 to-pink-600',
      accent: 'purple-50'
    },
    emerald: {
      name: 'Forest Green',
      primary: 'emerald',
      gradient: 'from-emerald-600 to-teal-600',
      accent: 'emerald-50'
    },
    rose: {
      name: 'Rose Garden',
      primary: 'rose',
      gradient: 'from-rose-600 to-pink-600',
      accent: 'rose-50'
    },
    amber: {
      name: 'Golden Sunset',
      primary: 'amber',
      gradient: 'from-amber-600 to-orange-600',
      accent: 'amber-50'
    }
  };

  const theme = themes[currentTheme];

  // Site configuration - Easy to customize
  const siteConfig = {
    name: 'Bookful', // Change this to your desired site name
    subtitle: 'Strive For Knowledge',
    logo: Feather, // You can change this to any Lucide icon
    fontStyle: 'font-bold bg-gradient-to-r bg-clip-text text-transparent' // Custom font styling
  };

  // Sample featured books for initial display
  const featuredBooks = [
    {
      id: 'featured1',
      title: 'To Kill a Mockingbird',
      authors: ['Harper Lee'],
      categories: ['Fiction'],
      description: 'A story about racial injustice and moral growth in the 1930s American South, seen through the eyes of young Scout Finch.',
      imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop' },
      publishedDate: '1960'
    },
    {
      id: 'featured2',
      title: 'Sapiens: A Brief History of Humankind',
      authors: ['Yuval Noah Harari'],
      categories: ['Non-Fiction'],
      description: 'An overview of human history, from the Stone Age to modern times, exploring key developments and revolutions.',
      imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop' },
      publishedDate: '2011'
    },
    {
      id: 'featured3',
      title: 'The Girl with the Dragon Tattoo',
      authors: ['Stieg Larsson'],
      categories: ['Mystery'],
      description: 'A journalist and a hacker investigate a decades-old disappearance, uncovering dark family secrets.',
      imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop' },
      publishedDate: '2005'
    },
    {
      id: 'featured4',
      title: 'The Guns of August',
      authors: ['Barbara W. Tuchman'],
      categories: ['History'],
      description: 'A detailed account of the first month of World War I and the events leading up to it.',
      imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop' },
      publishedDate: '1962'
    },
    {
      id: 'featured5',
      title: 'Dune',
      authors: ['Frank Herbert'],
      categories: ['Science Fiction'],
      description: 'A science fiction epic set on the desert planet Arrakis, focusing on power, betrayal, and survival.',
      imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=300&h=400&fit=crop' },
      publishedDate: '1965'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', filter: '' },
    { id: 'fiction', label: 'Fiction', filter: 'subject:fiction' },
    { id: 'nonfiction', label: 'Non-Fiction', filter: 'subject:nonfiction' },
    { id: 'scifi', label: 'Sci-Fi', filter: 'subject:science fiction' },
    { id: 'mystery', label: 'Mystery', filter: 'subject:mystery' },
    { id: 'history', label: 'History', filter: 'subject:history' }
  ];

  useEffect(() => {
    // Initialize with featured books
    if (books.length === 0 && !searchTerm) {
      setBooks(featuredBooks);
    }
  }, []);

  const searchBooks = async (query, category = activeCategory) => {
    if (!query.trim()) {
      setBooks(featuredBooks);
      return;
    }

    setLoading(true);
    try {
      const categoryFilter = categories.find(cat => cat.id === category)?.filter || '';
      const searchQuery = categoryFilter ? `${query}+${categoryFilter}` : query;
      
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20&printType=books`
      );
      
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      
      const formattedBooks = data.items?.map(item => ({
        id: item.id,
        title: item.volumeInfo.title || 'Unknown Title',
        authors: item.volumeInfo.authors || ['Unknown Author'],
        categories: item.volumeInfo.categories || ['Uncategorized'],
        description: item.volumeInfo.description || 'No description available.',
        imageLinks: item.volumeInfo.imageLinks || { thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop' },
        publishedDate: item.volumeInfo.publishedDate || 'Unknown',
        previewLink: item.volumeInfo.previewLink
      })) || [];
      
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e && e.preventDefault();
    searchBooks(searchTerm, activeCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (searchTerm) {
      searchBooks(searchTerm, categoryId);
    } else {
      // Filter featured books by category
      if (categoryId === 'all') {
        setBooks(featuredBooks);
      } else {
        const categoryLabel = categories.find(cat => cat.id === categoryId)?.label;
        const filtered = featuredBooks.filter(book => 
          book.categories.some(cat => 
            cat.toLowerCase().includes(categoryLabel.toLowerCase()) ||
            (categoryId === 'scifi' && cat.toLowerCase().includes('science fiction'))
          )
        );
        setBooks(filtered);
      }
    }
  };

  const toggleFavorite = (book) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === book.id);
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const isFavorite = (bookId) => {
    return favorites.some(fav => fav.id === bookId);
  };

  const getThemeClasses = (variant = 'primary') => {
    const primary = theme.primary;
    const darkPrefix = isDarkMode ? 'dark:' : '';
    
    switch (variant) {
      case 'button':
        return `bg-${primary}-600 hover:bg-${primary}-700 text-white`;
      case 'active':
        return `bg-${primary}-600 text-white shadow-lg`;
      case 'accent':
        return isDarkMode 
          ? `text-${primary}-400 bg-${primary}-900/30` 
          : `text-${primary}-600 bg-${primary}-50`;
      case 'border':
        return `border-${primary}-500 focus:border-${primary}-500`;
      case 'gradient':
        return `bg-gradient-to-r ${theme.gradient}`;
      default:
        return `text-${primary}-600`;
    }
  };

  const LogoIcon = siteConfig.logo;

  const BookCard = ({ book }) => (
    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="relative group">
        <img
          src={book.imageLinks?.thumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'}
          alt={book.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <BookOpen className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" size={32} />
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${getThemeClasses('accent')}`}>
            {book.categories[0]}
          </span>
        </div>
        
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {book.title}
        </h3>
        
        <div className={`flex items-center mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <User size={16} className="mr-2" />
          <span className="text-sm">{book.authors[0]}</span>
        </div>
        
        {book.publishedDate && (
          <div className={`flex items-center mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">{book.publishedDate.substring(0, 4)}</span>
          </div>
        )}
        
        <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {book.description.length > 120 ? `${book.description.substring(0, 120)}...` : book.description}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => toggleFavorite(book)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isFavorite(book.id)
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            <Heart 
              size={18} 
              fill={isFavorite(book.id) ? 'white' : 'none'} 
              className={isFavorite(book.id) ? 'text-white' : 'text-white'}
            />
            <span className="font-medium">
              {isFavorite(book.id) ? 'Favorited' : 'Add to Favorites'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <LogoIcon className={`${getThemeClasses()} mr-3`} size={36} />
              <div className="flex flex-col">
                <h1 className={`text-3xl ${siteConfig.fontStyle} ${getThemeClasses('gradient')}`}>
                  {siteConfig.name}
                </h1>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {siteConfig.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Dark/Light Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Theme Selector */}
              <div className="relative group">
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}>
                  <Palette size={20} />
                </button>
                <div className={`absolute right-0 top-12 rounded-lg shadow-lg border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-40 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentTheme(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        currentTheme === key 
                          ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') 
                          : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                      } ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeOption.gradient}`}></div>
                      {themeOption.name}
                    </button>
                  ))}
                </div>
              </div>

              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 'home'
                      ? getThemeClasses('accent')
                      : (isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600')
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage('favorites')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'favorites'
                      ? getThemeClasses('accent')
                      : (isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600')
                  }`}
                >
                  <Heart size={18} />
                  Favourites ({favorites.length})
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' ? (
          <>
            {/* Categories */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                      activeCategory === category.id
                        ? getThemeClasses('active')
                        : (isDarkMode 
                            ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 shadow-md border border-gray-700' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md')
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-12">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search books by Title or Author"
                    className={`w-full pl-12 pr-4 py-4 text-lg rounded-full border-2 focus:outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                    } ${getThemeClasses('border')}`}
                  />
                  <button
                    onClick={handleSearch}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-full transition-colors ${getThemeClasses('button')}`}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primary}-600`}></div>
              </div>
            )}

            {/* Books Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && books.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <BookOpen className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={48} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No books found
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Try searching with different keywords or browse our categories.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Favorites Page */
          <div>
            <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Favorite Books
            </h2>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={48} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No favorites yet
                </h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Start adding books to your favorites to see them here.
                </p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`px-6 py-3 rounded-lg transition-colors ${getThemeClasses('button')}`}
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {favorites.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t shadow-lg ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex-1 py-4 flex flex-col items-center ${
              currentPage === 'home' 
                ? getThemeClasses() 
                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
            }`}
          >
            <BookOpen size={20} />
            <span className="text-sm mt-1">Home</span>
          </button>
          <button
            onClick={() => setCurrentPage('favorites')}
            className={`flex-1 py-4 flex flex-col items-center ${
              currentPage === 'favorites' 
                ? getThemeClasses() 
                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
            }`}
          >
            <Heart size={20} />
            <span className="text-sm mt-1">Favorites</span>
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BookFinder;