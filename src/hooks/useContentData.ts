
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock data for development
const mockCategories = [
  { id: '1', name: 'Fiction', description: 'Fictional stories and novels', icon: '📚' },
  { id: '2', name: 'Self-Help', description: 'Personal development and growth', icon: '🌱' },
  { id: '3', name: 'Business', description: 'Business and entrepreneurship', icon: '💼' },
  { id: '4', name: 'Science', description: 'Scientific discoveries and research', icon: '🔬' },
  { id: '5', name: 'History', description: 'Historical events and figures', icon: '🏛️' },
  { id: '6', name: 'Mystery', description: 'Thriller and mystery stories', icon: '🔍' }
];

const mockSeries = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    category_id: '1',
    total_episodes: 12,
    is_premium: false,
    is_featured: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Fiction' }
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category_id: '2',
    total_episodes: 8,
    is_premium: true,
    is_featured: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Self-Help' }
  },
  {
    id: '3',
    title: 'Zero to One',
    author: 'Peter Thiel',
    description: 'Notes on Startups, or How to Build the Future',
    cover_image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
    category_id: '3',
    total_episodes: 10,
    is_premium: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Business' }
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A Brief History of Humankind',
    cover_image_url: 'https://images.unsplash.com/photo-1618944791258-19ae5c5d98df?w=400',
    category_id: '5',
    total_episodes: 15,
    is_premium: false,
    is_featured: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'History' }
  },
  {
    id: '5',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'A psychological thriller about a woman who refuses to speak',
    cover_image_url: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=400',
    category_id: '6',
    total_episodes: 9,
    is_premium: false,
    is_featured: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Mystery' }
  },
  {
    id: '6',
    title: 'Cosmos',
    author: 'Carl Sagan',
    description: 'A Personal Voyage through Space and Time',
    cover_image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    category_id: '4',
    total_episodes: 13,
    is_premium: true,
    is_featured: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Science' }
  },
  {
    id: '7',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    description: 'Powerful Lessons in Personal Change',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    category_id: '2',
    total_episodes: 7,
    is_premium: false,
    is_featured: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Self-Help' }
  },
  {
    id: '8',
    title: 'Sherlock Holmes: The Complete Collection',
    author: 'Arthur Conan Doyle',
    description: 'The complete adventures of the world\'s greatest detective',
    cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    category_id: '6',
    total_episodes: 20,
    is_premium: true,
    is_featured: true,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    categories: { name: 'Mystery' }
  }
];

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      // If no data or error, return mock data
      if (error || !data || data.length === 0) {
        console.log('Using mock categories data');
        return mockCategories;
      }
      return data;
    },
  });
};

export const useSeries = () => {
  return useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('series')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      // If no data or error, return mock data
      if (error || !data || data.length === 0) {
        console.log('Using mock series data');
        return mockSeries;
      }
      return data;
    },
  });
};

export const useEpisodes = (seriesId?: string) => {
  return useQuery({
    queryKey: ['episodes', seriesId],
    queryFn: async () => {
      if (!seriesId) return [];
      
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('series_id', seriesId)
        .order('episode_number');
      
      if (error) throw error;
      return data;
    },
    enabled: !!seriesId,
  });
};
