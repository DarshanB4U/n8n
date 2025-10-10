import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { log } from "console";
export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main >
          <SidebarTrigger className="bg-teal-900" />

          <div>{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
