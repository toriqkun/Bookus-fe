"use client";
// import type { Metadata } from "next";
import "./globals.css";
import { usePathname } from "next/navigation";
import HomeLayout from "@/app/components/HomeLayout";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/app/context/AuthContext";

// export const metadata: Metadata = {
//   title: "Schedule Library Ordering Time and In Fact Yours",
//   description: "Build web Todo App",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarPaths = ["/home", "/dashboard", "/profile"];
  const useSidebar = sidebarPaths.some((path) => pathname.startsWith(path));

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {useSidebar ? <HomeLayout>{children}</HomeLayout> : <div>{children}</div>}

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#333",
                fontWeight: "500",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              success: {
                iconTheme: {
                  primary: "#6d28d9",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
