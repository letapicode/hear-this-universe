
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center animate-scale-in">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all duration-200 huly-text-sm
            ${selectedCategory === category 
              ? "huly-gradient text-white huly-shadow hover:huly-shadow-hover hover:scale-105" 
              : "huly-glass border-white/10 text-foreground hover:bg-white/5 hover:scale-105 hover:border-primary/30"
            }
          `}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
