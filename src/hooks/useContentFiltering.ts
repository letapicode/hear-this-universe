
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
      isPremium: s.is_premium
    }));
  }, [series]);

  const filteredContent = useMemo(() => {
    return transformedSeries.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           content.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
      
      const matchesFilters = filters.categories.length === 0 || filters.categories.includes(content.category);
      const matchesPremium = filters.isPremium === undefined || content.isPremium === filters.isPremium;
      
      return matchesSearch && matchesCategory && matchesFilters && matchesPremium;
    });
  }, [transformedSeries, searchQuery, selectedCategory, filters]);

  const featuredContent = useMemo(() => {
    return transformedSeries.filter(s => series.find(original => original.id === s.id)?.is_featured);
  }, [transformedSeries, series]);

  const trendingContent = useMemo(() => {
    return transformedSeries.slice(0, 2);
  }, [transformedSeries]);

  return {
    transformedSeries,
    filteredContent,
    featuredContent,
    trendingContent
  };
};
