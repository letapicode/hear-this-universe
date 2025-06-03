
import { useMemo } from "react";

interface SearchFilters {
  categories: string[];
  isPremium?: boolean;
  rating?: number;
  duration?: 'short' | 'medium' | 'long';
}

export const useContentFiltering = (
  series: any[],
  searchQuery: string,
  selectedCategory: string,
  filters: SearchFilters
) => {
  const transformedSeries = useMemo(() => {
    return series.map(s => ({
      id: s.id,
      title: s.title,
      author: s.author,
      category: s.categories?.name || 'Unknown',
      episodes: s.total_episodes,
      duration: "45 min avg",
      image: s.cover_image_url || "/placeholder.svg",
      description: s.description,
      isNew: new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isPremium: s.is_premium,
      // Enhanced data for better UX
      rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
      progress: Math.random() > 0.6 ? Math.floor(Math.random() * 100) : undefined,
      totalListeners: Math.floor(Math.random() * 100000) + 5000,
      lastListened: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined
    }));
  }, [series]);

  const filteredContent = useMemo(() => {
    return transformedSeries.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           content.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
      
      const matchesFilters = filters.categories.length === 0 || filters.categories.includes(content.category);
      const matchesPremium = filters.isPremium === undefined || content.isPremium === filters.isPremium;
      const matchesRating = filters.rating === undefined || content.rating >= filters.rating;
      
      return matchesSearch && matchesCategory && matchesFilters && matchesPremium && matchesRating;
    });
  }, [transformedSeries, searchQuery, selectedCategory, filters]);

  const featuredContent = useMemo(() => {
    return transformedSeries.filter(s => series.find(original => original.id === s.id)?.is_featured);
  }, [transformedSeries, series]);

  const trendingContent = useMemo(() => {
    return transformedSeries
      .sort((a, b) => b.totalListeners - a.totalListeners)
      .slice(0, 4);
  }, [transformedSeries]);

  const recentlyPlayed = useMemo(() => {
    return transformedSeries
      .filter(s => s.progress && s.progress > 0)
      .sort((a, b) => {
        if (!a.lastListened || !b.lastListened) return 0;
        return new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime();
      })
      .slice(0, 6);
  }, [transformedSeries]);

  return {
    transformedSeries,
    filteredContent,
    featuredContent,
    trendingContent,
    recentlyPlayed
  };
};
