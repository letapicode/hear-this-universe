
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
      <section className="huly-section pb-8">
        <div className="huly-container">
          <EnhancedSearch
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            availableCategories={availableCategories}
          />
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-16">
        <div className="huly-container">
          <CategoryFilter 
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </section>
    </>
  );
};

export default SearchAndFiltersSection;
