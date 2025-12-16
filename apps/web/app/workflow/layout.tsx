import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { CredentialProvider } from "@/context/credentialContext";
export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#12151b]  overflow-hidden">
      <CredentialProvider>
        <SidebarProvider>
          <AppSidebar />

          <div className="p-2 overflow-hidden">
            {children}
            {/* <SidebarTrigger className="bg-teal-900" /> */}
          </div>

          <Toaster />
        </SidebarProvider>
      </CredentialProvider>
    </div>
  );
}
