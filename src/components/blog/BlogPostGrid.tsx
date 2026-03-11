import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/lib/database/index";
import { BlogPost } from "@/lib/database/types";
import { BlogPostCard } from "./BlogPostCard";
import { Skeleton } from "@/components/ui/skeleton";

export const BlogPostGrid = () => {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      return await blogService.getAll();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400">No hay posts publicados aún</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};