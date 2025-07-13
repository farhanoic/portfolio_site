"use client";

import { motion } from "framer-motion";
import { ServiceGridProps } from "@/types/services";
import ServiceCard from "./ServiceCard";

export default function ServiceGrid({ items, onItemClick }: ServiceGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.div
          key={item._id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.4 }}
        >
          <ServiceCard
            item={item}
            onClick={onItemClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}