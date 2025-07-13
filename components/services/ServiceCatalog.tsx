"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceCatalogProps, ServiceItem } from "@/types/services";
import CategoryTabs from "./CategoryTabs";
import FilterButtons from "./FilterButtons";
import ServiceGrid from "./ServiceGrid";
import ServiceModal from "./ServiceModal";

export default function ServiceCatalog({ categories, filters, items }: ServiceCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.slug || "");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter items based on selected category and filter
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = item.category.slug === selectedCategory;
      const matchesFilter = selectedFilter === "all" || item.filter.slug === selectedFilter;
      return matchesCategory && matchesFilter;
    });
  }, [items, selectedCategory, selectedFilter]);

  // Get filters for the selected category
  const categoryFilters = useMemo(() => {
    return filters.filter(filter => filter.category.slug === selectedCategory);
  }, [filters, selectedCategory]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedFilter("all"); // Reset filter when changing category
  };

  const handleItemClick = (item: ServiceItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Browse My Services
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore my portfolio of work across different styles and categories. 
          Each example showcases the quality and approach you can expect for your project.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Filter Buttons */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <FilterButtons
            filters={categoryFilters}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </motion.div>
      </AnimatePresence>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between text-sm text-muted-foreground"
      >
        <span>
          {filteredItems.length} {filteredItems.length === 1 ? 'service' : 'services'} found
        </span>
        {selectedFilter !== "all" && (
          <button
            onClick={() => setSelectedFilter("all")}
            className="text-primary hover:underline"
          >
            Clear filter
          </button>
        )}
      </motion.div>

      {/* Service Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${selectedFilter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <ServiceGrid
            items={filteredItems}
            onItemClick={handleItemClick}
          />
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">No services found</h3>
          <p className="text-muted-foreground">
            Try selecting a different filter or category to see more options.
          </p>
        </motion.div>
      )}

      {/* Service Modal */}
      <ServiceModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}