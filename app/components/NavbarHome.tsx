// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { Home, Star, Bell, User, LogOut, LayoutDashboard } from "lucide-react";
// import Image from "next/image";
// import api from "@/app/utils/axios";

// export default function SidebarHome({ user }: { user: any }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleLogout = async () => {
//     try {
//       await api.post("/auth/logout");
//       router.push("/login");
//     } catch (err) {
//       console.error("Logout gagal", err);
//     }
//   };

//   const navItems = [
//     { name: "Home", icon: Home, path: "/home" },
//     { name: "Profile", icon: User, path: "/profile" },
//     // { name: "Favorites", icon: Star, path: "/favorites" },
//     // { name: "Notification", icon: Bell, path: "/notifications" },
//     { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
//   ];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col justify-between z-40">
//       {/* Header */}
//       <div>
//         <div className="flex items-center px-2 py-5 border-b border-gray-100 gap-2">
//           <Image src="/brand.png" alt="logo" width={65} height={45} className="rounded" />
//           <h1 className="text-lg font-bold text-purple-600">Slotify</h1>
//         </div>

//         {/* Nav Links */}
//         <nav className="mt-6 space-y-2 px-2 flex flex-col">
//           {navItems.map(({ name, icon: Icon, path }) => {
//             const active = pathname === path;
//             return (
//               <button
//                 key={name}
//                 onClick={() => router.push(path)}
//                 className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors cursor-pointer ${
//                   active
//                     ? "bg-purple-100 text-purple-700 font-medium"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <Icon size={20} />
//                 <span>{name}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* User & Logout */}
//       <div className="border-t border-gray-100 px-3 mb-10 py-4">
//         <div className="flex items-center gap-3 mb-3">
//           <Image
//             src={user?.avatarImage || "/default-avatar.jpg"}
//             alt="User Avatar"
//             width={38}
//             height={38}
//             className="rounded-full object-cover"
//           />
//           <p className="text-lg font-medium text-gray-800">{user?.name || "User"}</p>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 text-red-500 hover:text-red-600 text-lg"
//         >
//           <LogOut size={16} width={40} height={25} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, User, LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import api from "@/app/utils/axios";
import { useAuth } from "@/app/context/AuthContext";

export default function NavbarHome() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      // setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout gagal", err);
    }
  };

  const navItems = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 py-3 shadow-sm">
      {/* LEFT: Brand */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/home")}>
        <Image src="/brand.png" alt="logo" width={50} height={35} className="rounded" />
        <h1 className="text-xl font-bold text-purple-600">Slotify</h1>
      </div>

      {/* CENTER: Nav links */}
      <div className="flex items-center gap-6">
        {navItems.map(({ name, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <button
              key={name}
              onClick={() => router.push(path)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-colors ${
                active ? "text-purple-700 font-medium border-b-2 border-purple-500" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT: User + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-purple-200 px-3 py-1 rounded-full">
          <span className="text-gray-800 font-medium">{user?.name || "User"}</span>
          <Image src={user?.avatarImage || "/default-avatar.jpg"} alt="User Avatar" width={36} height={36} className="rounded-full object-cover border-2 border-gray-600" />
        </div>

        <button onClick={handleLogout} className="text-red-600 hover:text-red-700 bg-red-200 hover:bg-red-300 p-[7px] rounded-full transition-colors cursor-pointer" title="Logout">
          <LogOut size={23} />
        </button>
      </div>
    </nav>
  );
}
