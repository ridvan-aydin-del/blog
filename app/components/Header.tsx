"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="bg-gray-100 shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Logo
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700 text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
