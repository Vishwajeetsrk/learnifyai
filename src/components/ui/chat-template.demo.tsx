import { Home } from "@/components/blocks/chat-template";
import { SidebarProvider } from "@/components/blocks/sidebar";

export function ChatTemplateDemo() {
  return (
    <SidebarProvider>
      <Home />
    </SidebarProvider>
  );
}

export default ChatTemplateDemo;
