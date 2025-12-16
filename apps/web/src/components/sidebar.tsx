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
import Image from "next/image";

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
    <Sidebar className="bg-transparent ">
      <div className="bg-[#14161a] flex gap-1 items-center p-2">
        <div className="bg-[#1e3f86] p-1.5 rounded-l-3xl rounded-r-xs shadow-3xl">
          <Image
            src="/Tasker.svg"
            alt="Tasker logo"
            className="shadow-2xl"
            width={30}
            height={30}
          />
        </div>

        <h1 className="font-bold text-xl shadow-2xl">Tasker</h1>
      </div>
      <SidebarContent className="bg-[#14161a]">
        <SidebarGroup>
          <div className=" flex-clos items-center p-1 rounded-2xl"></div>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="pt-2 pb-2   " key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-4 py-2.5 
                 rounded-sm transition-all duration-200
                 text-gray-50 hover:text-white
                  focus:bg-[#323c54]
                 shadow-sm hover:shadow-md"
                    >
                      <item.icon className="w-5 h-5 text-[#4f516b]" />

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
