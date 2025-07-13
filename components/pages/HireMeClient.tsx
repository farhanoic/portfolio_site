"use client";

import { motion } from "framer-motion";
import ServiceCatalog from "@/components/services/ServiceCatalog";
import PortfolioShowcase from "@/components/portfolio/PortfolioShowcase";
import type { ServiceCategory, ServiceFilter, ServiceItem } from "@/types/services";
import type { PortfolioProject, PortfolioCategory } from "@/lib/sanity-data";

interface HireMeClientProps {
  categories: ServiceCategory[];
  filters: ServiceFilter[];
  services: ServiceItem[];
  portfolioCategories: PortfolioCategory[];
  portfolioProjects: PortfolioProject[];
}

export default function HireMeClient({ categories, filters, services, portfolioCategories, portfolioProjects }: HireMeClientProps) {
  return (
    <main className="min-h-screen pt-16 py-12">
      <div className="container mx-auto px-6 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Let's Work{" "}
            <span className="text-primary">Together</span>
          </h1>
          
          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-3 dashboard-card px-4 py-3"
          >
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Available for new projects</span>
          </motion.div>
        </motion.div>

        {/* Service Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ServiceCatalog 
            categories={categories}
            filters={filters}
            items={services}
          />
        </motion.div>

        {/* Empty State for Services */}
        {services.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">No services yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Add your first service in Sanity Studio at{" "}
              <a 
                href="http://localhost:3333" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                localhost:3333
              </a>
            </p>
          </motion.div>
        )}

        {/* Portfolio Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          id="portfolio"
          className="pt-12"
        >
          {/* Section Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-8"></div>
          
          {/* Portfolio Header */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              My Recent <span className="text-primary">Work</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Browse my portfolio organized by category
            </p>
          </div>
          
          <PortfolioShowcase 
            categories={portfolioCategories}
            projects={portfolioProjects}
          />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center space-y-6 max-w-2xl mx-auto"
        >
          <h2 className="text-xl md:text-2xl font-semibold">Have Questions?</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="mailto:hello@farhanoic.me"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="dashboard-card px-6 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
            >
              Send Email
            </motion.a>
            
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="dashboard-card px-6 py-3 hover:border-primary transition-all duration-300"
            >
              Connect on LinkedIn
            </motion.a>
          </div>

          <p className="text-muted-foreground text-sm">
            Typically respond within 24 hours. Let's discuss your project requirements!
          </p>
        </motion.div>
      </div>
    </main>
  );
}