"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

interface Posts {
  id: string;
  title: string;
  content: string;
  image_url?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");

      if (error) {
        console.error("Postlar yüklenirken hata:", error.message);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-20">
      {posts.map((post) => (
        <Link
          href={`/post/${post.id}`}
          key={post.id}
          className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition group"
        >
          <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={post.title}
                className="object-cover w-full h-full group-hover:scale-105 transition"
              />
            ) : (
              <span className="text-gray-500">Görsel Yok</span>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">
              {post.title}
            </h2>
          </div>

          <div className="p-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Detaylar
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
