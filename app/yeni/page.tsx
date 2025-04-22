"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const Yeni = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      setErrorMessage(error.message);
    } else {
      alert("Post başarıyla eklendi!");
      setTitle("");
      setContent("");
      setImageUrl("");
      setErrorMessage("");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl mb-4">Yeni Post Ekle</h1>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Açıklama"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="text"
        placeholder="Resim URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Gönder
      </button>
    </div>
  );
};

export default Yeni;
