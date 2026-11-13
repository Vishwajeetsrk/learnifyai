"use client"

// ** Imports: React & Hooks **
import React, { useState } from "react"

// ** UI Components **
import {
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/blocks/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CardDescription, CardTitle } from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

// ** Dropdown Menu Components **
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ** Icons **
import {
  Brush,
  Camera,
  ChartBarIncreasing,
  ChevronUp,
  CircleFadingPlus,
  CircleOff,
  CircleUserRound,
  File,
  Image,
  ListFilter,
  Menu,
  MessageCircle,
  MessageSquareDashed,
  MessageSquareDot,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Smile,
  SquarePen,
  Star,
  User,
  User2,
  UserRound,
  Users,
  Video,
} from "lucide-react"

// ** Contact List **
const contactList = [
  {
    name: "Manoj Rayi",
    message: "Your Last Message Here",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Anjali Kumar",
    message: "Hello, how are you?",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Ravi Teja",
    message: "Looking forward to the meeting.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Sneha Reddy",
    message: "Can you send the report?",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Arjun Das",
    message: "Thank you for your help!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Priya Sharma",
    message: "Let's catch up soon.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
]

// ** Sidebar Menu Items **
const menuItems = [
  { title: "Messages", url: "#", icon: MessageCircle },
  { title: "Phone", url: "#", icon: Phone },
  { title: "Status", url: "#", icon: CircleFadingPlus },
]

// ** Home Component **
export const Home = () => {
  const { toggleSidebar } = useSidebar()
  const [currentChat, setCurrentChat] = useState(contactList[0])

  return (
    <>
      {/* Sidebar */}
      <Sidebar variant="floating" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigate</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={toggleSidebar} asChild>
                    <span>
                      <Menu />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings /> Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Account
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Back Up</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-1rem)] min-h-[500px]">
          {/* Left Panel - Chat List */}
          <ResizablePanel defaultSize={25} minSize={20} className="flex-grow">
            <div className="flex flex-col h-full border ml-1 rounded-lg overflow-hidden bg-card">
              <div className="h-12 px-3 py-2 flex items-center border-b">
                <p className="ml-1 font-semibold text-sm">Chats</p>
                <div className="flex justify-end w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SquarePen className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" /> New Contact
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" /> New Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ListFilter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Filter Chats By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <MessageSquareDot className="h-4 w-4 mr-2" /> Unread
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="h-4 w-4 mr-2" /> Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CircleUserRound className="h-4 w-4 mr-2" /> Contacts
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CircleOff className="h-4 w-4 mr-2" /> Non Contacts
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" /> Groups
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquareDashed className="h-4 w-4 mr-2" /> Drafts
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative px-3 py-2 border-b">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search or start new chat"
                  className="pl-9 h-8 text-xs"
                />
              </div>

              {/* Contact List */}
              <ScrollArea className="flex-grow">
                {contactList.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChat(contact)}
                    className="px-3 w-full py-2.5 hover:bg-muted/60 transition-colors cursor-pointer text-left border-b border-border/40"
                  >
                    <div className="flex flex-row items-center gap-2.5">
                      <Avatar className="size-10">
                        <AvatarImage src={contact.image} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <CardTitle className="text-xs font-semibold truncate">{contact.name}</CardTitle>
                        <CardDescription className="text-[11px] truncate">{contact.message}</CardDescription>
                      </div>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Chat Window */}
          <ResizablePanel defaultSize={75} minSize={40}>
            <div className="flex flex-col justify-between h-full ml-1 pb-2 border rounded-lg overflow-hidden bg-card">
              {/* Chat Header */}
              <div className="h-14 border-b flex items-center px-4 bg-muted/20">
                <Avatar className="size-10">
                  <AvatarImage src={currentChat?.image} />
                  <AvatarFallback>{currentChat?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5 ml-3">
                  <CardTitle className="text-sm font-semibold">{currentChat?.name}</CardTitle>
                  <CardDescription className="text-xs">Active Chat</CardDescription>
                </div>
                <div className="flex-grow flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <div className="self-start max-w-[70%] p-3 rounded-2xl bg-muted text-foreground text-xs leading-relaxed">
                    {currentChat?.message}
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-1.5 p-2 border-t bg-background">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Image className="h-4 w-4 mr-2" /> Photos & Videos
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Camera className="h-4 w-4 mr-2" /> Camera
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <File className="h-4 w-4 mr-2" /> Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserRound className="h-4 w-4 mr-2" /> Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ChartBarIncreasing className="h-4 w-4 mr-2" /> Poll
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Brush className="h-4 w-4 mr-2" /> Drawing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  className="flex-grow border-0 focus-visible:ring-0 text-xs h-9 bg-muted/40"
                  placeholder="Type a message..."
                />
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </>
  )
}
export default Home;
