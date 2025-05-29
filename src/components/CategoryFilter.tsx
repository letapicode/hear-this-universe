
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center animate-scale-in">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`
            px-8 py-4 rounded-xl font-medium transition-all duration-300 text-lg
            ${selectedCategory === category 
              ? "luxury-gradient text-white shadow-lg hover:scale-105" 
              : "glass-morphism border-white/20 text-foreground hover:bg-white/10 hover:scale-105 hover:border-primary/50"
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
