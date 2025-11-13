import { Home, Inbox, Settings, BookLock } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";


const items = [
  // {
  //   title: "Home",
  //   url: "",
  //   icon: Home,
  // },
  {
    title: "Workflows",
    url: "/workflow",
    icon: Inbox,
  },
  {
    title: "Credentials",
    url: "/workflow/credentials",
    icon: BookLock,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className=" flex-clos items-center p-1 rounded-2xl"></div>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="pt-2 pb-2" key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-4 py-2.5 
                 rounded-xl transition-all duration-200
                 text-gray-50 hover:text-white
                 hover:bg-emerald-600 focus:bg-emerald-700
                 shadow-sm hover:shadow-md"
                    >
                      <item.icon className="w-5 h-5 text-emerald-500 " />

                      <span className="text-base  font-medium tracking-wide">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
