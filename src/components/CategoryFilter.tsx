
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`${
            selectedCategory === category
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border-border hover:bg-accent hover:text-accent-foreground"
          } transition-all duration-200 font-medium px-4 py-2`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
