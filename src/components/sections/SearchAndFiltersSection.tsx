
import CategoryFilter from "@/components/CategoryFilter";
import EnhancedSearch from "@/components/EnhancedSearch";

interface SearchAndFiltersSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  availableCategories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SearchAndFiltersSection = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableCategories,
  selectedCategory,
  onCategoryChange
}: SearchAndFiltersSectionProps) => {
  return (
    <>
      {/* Enhanced Search Section */}
      <section className="container mx-auto px-8 mb-12">
        <EnhancedSearch
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          availableCategories={availableCategories}
        />
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-8 mb-20">
        <CategoryFilter 
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </section>
    </>
  );
};

export default SearchAndFiltersSection;
