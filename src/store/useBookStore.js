import { create } from 'zustand';

const useBookStore = create((set) => ({
  books: [],
  favourites: [],
  darkMode: false,
  searchQuery: '',
  selectedCategory: 'All',
  loading: false,
  error: '',
  hasSearched: false,

  setBooks: (books) => set({ books }),
  addToFavourites: (book) => set((state) => ({
    favourites: [...state.favourites.filter(b => b.id !== book.id), book]
  })),
  removeFromFavourites: (bookId) => set((state) => ({
    favourites: state.favourites.filter(b => b.id !== bookId)
  })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setHasSearched: (value) => set({ hasSearched: value }),
}));

export default useBookStore;
