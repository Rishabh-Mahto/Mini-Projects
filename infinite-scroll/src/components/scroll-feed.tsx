import { useCallback, useEffect, useRef, useState } from "react";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const ScrollFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`
      );
      const data: Post[] = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post.id));
          const newPosts = data.filter((post) => !existingIds.has(post.id));
          return [...prev, ...newPosts];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect(); // Clean up previous observer
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );
    if (loaderRef.current) observer.current.observe(loaderRef.current); // Observe the loader element
    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [fetchPosts, hasMore]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <p> This is the place where the scrollfeed will be presend</p>
      {posts.map((post) => (
        <div
          className="border border-gray-300 rounded-lg flex flex-col items-start w-[400px] h-[fit-content] p-4 mb-4"
          key={post.id}
        >
          <h2 className="text-lg text-blue-700 font-bold text-start">
            {post.title}
          </h2>
          <p className="p-0 text-start text-sm text-gray-500">{post.body}</p>
        </div>
      ))}
      <div ref={loaderRef} />
    </div>
  );
};
