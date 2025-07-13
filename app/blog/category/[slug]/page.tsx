import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  // Redirect to main blog page with category filter
  redirect(`/blog?category=${slug}`);
}