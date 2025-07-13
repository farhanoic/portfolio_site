// Hardcoded author information for Farhan Azhar
// This replaces the dynamic author system for a single-author blog

export interface BlogAuthor {
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  email?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
  };
}

export const BLOG_AUTHOR: BlogAuthor = {
  name: "Farhan Azhar",
  slug: "farhan-azhar",
  avatar: "/images/farhan-avatar.jpg", // Update with actual avatar path when available
  bio: "Full-stack developer and designer passionate about creating beautiful, functional web experiences. Specializing in modern web technologies and creative problem-solving.",
  email: "hello@farhanoic.me",
  website: "https://farhanoic.me",
  socialLinks: {
    twitter: "https://twitter.com/farhanoic",
    linkedin: "https://linkedin.com/in/farhanoic", 
    github: "https://github.com/farhanoic",
    instagram: "https://instagram.com/farhanoic",
    youtube: "https://youtube.com/@farhanoic"
  }
};