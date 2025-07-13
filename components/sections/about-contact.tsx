"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function AboutContact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skills = ["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Design"];
  const projects = [
    { name: "E-Commerce Platform", url: "#" },
    { name: "Design System", url: "#" },
    { name: "Mobile Banking App", url: "#" },
  ];
  const socialLinks = [
    { name: "GitHub", url: "https://github.com" },
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "Twitter", url: "https://twitter.com" },
  ];

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center space-y-12"
        >
          {/* About */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              I create modern digital experiences with clean code and thoughtful design. 
              Passionate about building products that are both beautiful and functional.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-muted-foreground"
            >
              5+ years experience turning ideas into reality.
            </motion.p>
          </div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium">Technologies</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 bg-background border border-border rounded-full text-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Featured Projects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium">Featured Work</h3>
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
              {projects.map((project, index) => (
                <motion.a
                  key={project.name}
                  href={project.url}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, color: "var(--primary)" }}
                  className="hover:text-primary transition-colors"
                >
                  {project.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium">Let's Connect</h3>
            
            {/* Email */}
            <motion.a
              href="mailto:hello@farhanoic.me"
              whileHover={{ scale: 1.05 }}
              className="inline-block text-xl text-primary font-medium hover:underline"
            >
              hello@farhanoic.me
            </motion.a>

            {/* Social Links */}
            <div className="flex justify-center space-x-8 text-muted-foreground">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.1, color: "var(--primary)" }}
                  className="hover:text-primary transition-colors"
                >
                  {social.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}