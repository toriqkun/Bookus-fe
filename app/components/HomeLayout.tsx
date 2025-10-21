"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/app/utils/useAuth";
import NavbarHome from "./NavbarHome";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(false);
  const router = useRouter();
  const pathname = usePathname();

  const protectedPaths = ["/home", "/dashboard", "/profile"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (!loading && isProtected && !user) {
      router.replace("/login");
    }
  }, [loading, isProtected, user, router]);

  if (loading) return null;
  if (isProtected && !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex">
      <NavbarHome />
      <main className="flex-1 transition-all duration-300">{children}</main>
    </div>
  );
}
