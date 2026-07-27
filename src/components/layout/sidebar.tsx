"use client";
import Logo from "@/assets/images/logo-smeq.jpg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebarStore } from "@/hooks/use-sidebar";
import { useAbility } from "@/hooks/use-ability";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/auth";
import { APP_ROUTES, type SidebarIconKey } from "@configs/app-routes";
import { hasAnyResourcePermission } from "@configs/permissions-matrix";
import {
  Archive,
  BookImage,
  Clapperboard,
  ChevronLeft,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Package,
  PanelBottom,
  Settings,
  Shield,
  Users,
  Calendar,
  CircleCheckBig,
  Briefcase,
  ShieldCheck,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  resources: string[];
  requiredActions?: string[];
}

const ICON_MAP: Record<SidebarIconKey, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  news: Newspaper,
  category: Package,
  "image-library": BookImage,
  "video-library": Clapperboard,
  "document-library": Archive,
  quotation: MessageSquareQuote,
  users: Users,
  permissions: Shield,
  settings: Settings,
  contact: MessageSquareQuote,
  "template-type": MessageSquareQuote,
  footer: PanelBottom,
  "organizational-chart": Users,
  "work-schedule": Calendar,
  "circleCheckBig": CircleCheckBig,
  service: Package,
  recruitment: Briefcase,
  shieldCheck: ShieldCheck,
  info: Info,
};

const navigation: NavItem[] = APP_ROUTES
  .filter((route) => !!route.sidebar)
  .map((route) => ({
    name: route.sidebar!.label,
    href: route.path,
    icon: ICON_MAP[route.sidebar!.icon],
    resources: route.access.resources,
    requiredActions: route.access.requiredActions,
  }));

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const ability = useAbility();
  const userPermissions = useAuthStore(state => state.permissions) || [];

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter((item) => {
    // SuperAdmin can see all
    if (ability.can("manage", "all")) return true;

    // Nếu route có requiredActions → phải khớp cả resource + action
    return hasAnyResourcePermission(userPermissions, item.resources, item.requiredActions);
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed overflow-auto inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 overflow-auto top-0 z-40 h-screen border-r bg-card transition-all duration-300",
          "lg:translate-x-0", // Always visible on desktop
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0 lg:w-20",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Header */}
          <div className="flex h-20 items-center justify-between px-4 bg-white">
            {isOpen && (
              <Link href="/dashboard" className="flex items-center space-x-1">
                <Image
                  src={Logo}
                  alt="SMEQ Logo"
                  width={120}
                  height={120}
                  className="rounded-xl object-cover"
                  priority
                />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="group ml-auto text-black hover:bg-[#0e3449] hover:text-white border bg-white"
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform group-hover:text-white text-black",
                  !isOpen && "rotate-180",
                )}
              />
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 space-y-2 py-4 bg-white">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center space-x-3 rounded-sm px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#19426D] text-white shadow-lg shadow-[#0f3b5a]/25"
                      : "text-muted-foreground hover:bg-[#0f3b5a]/6 hover:text-black dark:hover:bg-[#0f3b5a]/30 dark:hover:text-[#0f3b5a] ",
                    !isOpen && "justify-center",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "group-hover:text-black dark:group-hover:text-[#0f3b5a]",
                    )}
                  />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t bg-white dark:bg-[#0f3b5a]/30 p-4">
            <div
              className={cn(
                "text-xs text-muted-foreground",
                !isOpen && "text-center",
              )}
            >
              {isOpen ? (
                <div className="space-y-1">
                  <div className="font-medium text-black dark:text-gray-300">
                    SMEQ System
                  </div>
                  <div className="text-black">© 2025 All rights reserved</div>
                </div>
              ) : (
                <div className="text-xs text-black">©</div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
