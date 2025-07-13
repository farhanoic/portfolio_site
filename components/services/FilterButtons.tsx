"use client";

import { motion } from "framer-motion";
import { FilterButtonsProps } from "@/types/services";

export default function FilterButtons({ filters, selectedFilter, onFilterChange }: FilterButtonsProps) {
  // Add "All" option to the beginning
  const allFilters = [
    { _id: "all", name: "All", slug: "all", category: { _id: "", slug: "" }, order: 0 },
    ...filters
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap justify-center gap-3"
    >
      {allFilters.map((filter, index) => (
        <motion.button
          key={filter._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            selectedFilter === filter.slug
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
              : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
          }`}
        >
          {filter.name}
        </motion.button>
      ))}
    </motion.div>
  );
}