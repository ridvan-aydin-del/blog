"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Post {
  id: string;
  title: string;
  content: string;
  price: number;
  image_url?: string;
}
interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
}

const PostDetay = () => {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  //Post detayını al
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (error) {
        console.error("Hata:", error.message);
      } else {
        // Eğer image_url varsa public URL'e çevir

        setPost(data);
      }
    };

    fetchPost();
  }, [postId]);
  //Kullanıcıyı al
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    getUser();
  }, []);
  //Beğenmiş mi kontrol et
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!postId || !user) return;

      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        alert("Hata:" + error.message);
      } else {
        setLiked(!!data);
      }
    };

    checkIfLiked();
  }, [postId, user]); // postId veya user değişirse yeniden çalışacak
  //Beğen
  const handleLike = async () => {
    if (!postId || !user) return;

    const { error } = await supabase
      .from("likes")
      .insert({ user_id: user.id, post_id: postId });

    fetchLikeCount();

    if (error) {
      if (error.code === "23505") {
        console.log("Zaten beğenmişsin.");
      } else {
        console.error("Like eklenemedi:", error.message);
      }
    }
  };
  //Beğeni sayısını al
  const fetchLikeCount = async () => {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) {
      console.error("Beğeni sayısı alınamadı:", error.message);
    } else {
      setLikeCount(count); // state'e kaydet
    }
  };
  useEffect(() => {
    if (postId) {
      fetchLikeCount();
    }
  }, [postId]);
  // Yorum gönderme işlemi burada
  const handleCommentSubmit = async () => {
    if (!postId || !user || !commentText.trim()) return;

    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      post_id: postId,
      content: commentText.trim(),
    });

    if (error) {
      console.error("Yorum eklenemedi:", error.message);
    } else {
      console.log("Yorum eklendi!");
      setCommentText("");
    }
  };
  // Yorumları al
  const fetchComments = async () => {
    if (!postId) return;

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId);

    if (error) {
      console.error("Yorumlar alınamadı:", error.message);
    } else {
      setComments(data);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [postId]); // postId değişirse yeniden çalışacak
  return (
    <div className="mt-24 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">{post?.title}</h1>
      <p className="text-gray-600">{post?.content}</p>

      <img
        src={post?.image_url}
        alt={post?.title}
        className="w-full h-48 object-cover rounded-lg"
      />

      <button
        onClick={handleLike}
        disabled={liked} // Eğer kullanıcı beğendiyse, butonu devre dışı bırak
        className={`bg-blue-500 text-white py-2 px-4 rounded ${
          liked ? "bg-gray-500 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {liked ? "Beğendiniz" : "Beğen"}
      </button>

      <p>❤️ {likeCount} Beğeni</p>
      <div className="flex items-center space-x-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button onClick={handleCommentSubmit} className="m-3">
          Gönder
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Yorumlar</h2>
        {comments.length > 0 && (
          <p className="text-gray-600 mb-2">{comments.length} Yorum</p>
        )}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b py-5">
              <p className="text-gray-800 py-1">{comment.user_id}</p>
              <p className="text-gray-1000">{comment.content}</p>
            </div>
          ))
        ) : (
          <p>Henüz yorum yok.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetay;
