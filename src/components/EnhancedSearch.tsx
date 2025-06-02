
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SearchFilters {
  categories: string[];
  isPremium?: boolean;
  rating?: number;
  duration?: 'short' | 'medium' | 'long';
}

interface EnhancedSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableCategories: string[];
}

const EnhancedSearch = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  availableCategories 
}: EnhancedSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.isPremium !== undefined ? 1 : 0) + 
    (filters.rating ? 1 : 0) + 
    (filters.duration ? 1 : 0);

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      isPremium: undefined,
      rating: undefined,
      duration: undefined
    });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search by title, author, narrator..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-16 py-4 glass-morphism border-white/20 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-xl text-lg"
        />
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 glass-morphism border-white/20 hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-1" />
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 text-xs bg-purple-500">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 glass-morphism border-white/20 p-0">
            <Card className="border-0 bg-transparent">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Categories</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableCategories.filter(cat => cat !== 'All').map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm text-gray-300 cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Content */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Content Type</h4>
                  <RadioGroup
                    value={filters.isPremium === undefined ? 'all' : filters.isPremium ? 'premium' : 'free'}
                    onValueChange={(value) => {
                      onFiltersChange({
                        ...filters,
                        isPremium: value === 'all' ? undefined : value === 'premium'
                      });
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <label htmlFor="all" className="text-sm text-gray-300">All Content</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <label htmlFor="free" className="text-sm text-gray-300">Free Only</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="premium" id="premium" />
                      <label htmlFor="premium" className="text-sm text-gray-300">Premium Only</label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Minimum Rating</h4>
                  <RadioGroup
                    value={filters.rating?.toString() || 'any'}
                    onValueChange={(value) => {
                      onFiltersChange({
                        ...filters,
                        rating: value === 'any' ? undefined : parseInt(value)
                      });
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any-rating" />
                      <label htmlFor="any-rating" className="text-sm text-gray-300">Any Rating</label>
                    </div>
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm text-gray-300">
                          {rating}+ Stars
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={category} className="bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {category}
              <button
                onClick={() => toggleCategory(category)}
                className="ml-1 hover:bg-purple-400/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.isPremium !== undefined && (
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {filters.isPremium ? 'Premium' : 'Free'} Content
              <button
                onClick={() => onFiltersChange({ ...filters, isPremium: undefined })}
                className="ml-1 hover:bg-purple-400/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.rating && (
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {filters.rating}+ Stars
              <button
                onClick={() => onFiltersChange({ ...filters, rating: undefined })}
                className="ml-1 hover:bg-purple-400/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
