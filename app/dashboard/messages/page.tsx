"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search, Package, MessageCircle, ArrowLeft, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { mockConversations, mockSellers, mockVinyls } from "@/lib/mock-data"
import { motion } from "motion/react"
import { formatDistanceToNow } from "date-fns"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const conversation = selectedConversation ? mockConversations.find((c) => c.id === selectedConversation) : null

  const getOtherParticipant = (participants: string[]) => {
    const otherId = participants.find((p) => p !== "user")
    return mockSellers.find((s) => s.id === otherId)
  }

  const filteredConversations = mockConversations.filter((conv) => {
    const seller = getOtherParticipant(conv.participants)
    if (!seller) return false
    return seller.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In real app, would send message to backend
    setNewMessage("")
  }

  const unreadCount = mockConversations.filter((c) => !c.lastMessage.read).length

  // Mobile: show conversation list or chat
  // Desktop: show both side by side
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-auto">
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Conversation List */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-border/40 flex flex-col",
            selectedConversation ? "hidden md:flex" : "flex",
          )}
        >
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Messages</h1>
                {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} unread</p>}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-4 mt-4 mb-2 h-9">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs">
                Orders
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs">
                Social
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredConversations.map((conv) => {
                    const seller = getOtherParticipant(conv.participants)
                    const vinyl = conv.vinylId ? mockVinyls.find((v) => v.id === conv.vinylId) : null
                    if (!seller) return null

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={cn(
                          "w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3",
                          selectedConversation === conv.id ? "bg-accent" : "hover:bg-muted/50",
                        )}
                      >
                        <Avatar className="h-12 w-12 shrink-0">
                          <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                          <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm truncate">{seller.name}</p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                            </span>
                          </div>
                          {vinyl && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Package className="h-3 w-3" />
                              <span className="truncate">{vinyl.title}</span>
                            </div>
                          )}
                          <p
                            className={cn(
                              "text-xs truncate",
                              !conv.lastMessage.read ? "font-semibold text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {conv.lastMessage.senderId === "user" ? "You: " : ""}
                            {conv.lastMessage.content}
                          </p>
                        </div>
                        {!conv.lastMessage.read && conv.lastMessage.senderId !== "user" && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="orders" className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredConversations
                    .filter((c) => c.type === "transaction")
                    .map((conv) => {
                      const seller = getOtherParticipant(conv.participants)
                      const vinyl = conv.vinylId ? mockVinyls.find((v) => v.id === conv.vinylId) : null
                      if (!seller) return null

                      return (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={cn(
                            "w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3",
                            selectedConversation === conv.id ? "bg-accent" : "hover:bg-muted/50",
                          )}
                        >
                          <Avatar className="h-12 w-12 shrink-0">
                            <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                            <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{seller.name}</p>
                            {vinyl && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Package className="h-3 w-3" />
                                <span className="truncate">{vinyl.title}</span>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="social" className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredConversations
                    .filter((c) => c.type === "social")
                    .map((conv) => {
                      const seller = getOtherParticipant(conv.participants)
                      if (!seller) return null

                      return (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={cn(
                            "w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3",
                            selectedConversation === conv.id ? "bg-accent" : "hover:bg-muted/50",
                          )}
                        >
                          <Avatar className="h-12 w-12 shrink-0">
                            <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                            <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{seller.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat View */}
        <div className={cn("flex-1 flex flex-col min-h-0", selectedConversation ? "flex" : "hidden md:flex")}>
          {conversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/40 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {(() => {
                  const seller = getOtherParticipant(conversation.participants)
                  const vinyl = conversation.vinylId ? mockVinyls.find((v) => v.id === conversation.vinylId) : null
                  return (
                    <>
                      <Link href={`/seller/${seller?.id}`}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={seller?.avatar || "/placeholder.svg"} alt={seller?.name} />
                          <AvatarFallback>{seller?.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/seller/${seller?.id}`} className="font-semibold text-sm hover:underline">
                          {seller?.name}
                        </Link>
                        {vinyl && (
                          <Link
                            href={`/product/${vinyl.id}`}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                          >
                            <Package className="h-3 w-3" />
                            <span className="truncate">{vinyl.title}</span>
                          </Link>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </>
                  )
                })()}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversation.messages.map((message, index) => {
                    const isUser = message.senderId === "user"
                    const seller = !isUser ? getOtherParticipant(conversation.participants) : null

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}
                      >
                        {!isUser && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={seller?.avatar || "/placeholder.svg"} alt={seller?.name} />
                            <AvatarFallback>{seller?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2",
                            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              "text-[10px] mt-1",
                              isUser ? "text-primary-foreground/70" : "text-muted-foreground",
                            )}
                          >
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="rounded-full"
                  />
                  <Button type="submit" size="icon" className="rounded-full shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Select a conversation</h2>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <DashboardBottomNav />
    </div>
  )
}
