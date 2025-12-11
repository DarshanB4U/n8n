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
    <div>
      <CredentialProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className=" ">
            <div className="">
              {/* <SidebarTrigger className="bg-teal-900" /> */}
              {children}
            </div>
          </main>

          <Toaster />
        </SidebarProvider>
      </CredentialProvider>
    </div>
  );
}
