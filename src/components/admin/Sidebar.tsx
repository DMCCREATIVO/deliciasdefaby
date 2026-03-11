import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { adminRoutes } from "./AdminSidebar";

export function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 px-3">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {adminRoutes.map((route) => {
            const isActive = router.pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors",
                  isActive && "bg-brand-pink/10 text-brand-pink"
                )}
              >
                <route.icon className="w-5 h-5 mr-3" />
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 