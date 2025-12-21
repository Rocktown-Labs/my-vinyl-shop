"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, MessageCircle, Heart, Tag, Gavel, UserPlus, Check, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { mockNotifications } from "@/lib/mock-data"
import { motion } from "motion/react"
import { formatDistanceToNow } from "date-fns"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "follow":
        return <UserPlus className="h-4 w-4" />
      case "like":
        return <Heart className="h-4 w-4" />
      case "price_drop":
        return <Tag className="h-4 w-4" />
      case "bid":
        return <Gavel className="h-4 w-4" />
      default:
        return null
    }
  }

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600"
      case "message":
        return "bg-green-100 text-green-600"
      case "follow":
        return "bg-purple-100 text-purple-600"
      case "like":
        return "bg-red-100 text-red-600"
      case "price_drop":
        return "bg-amber-100 text-amber-600"
      case "bid":
        return "bg-orange-100 text-orange-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Stay updated on your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-full bg-transparent">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 sm:mb-6 h-9 sm:h-10">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-xs sm:text-sm">
            Unread
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Link href={notification.link || "#"}>
                <Card
                  className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    !notification.read ? "bg-accent/30" : ""
                  }`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getIconBgColor(
                            notification.type,
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={(e) => e.preventDefault()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.read && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault()
                                    markAsRead(notification.id)
                                  }}
                                >
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-2">
          {notifications.filter((n) => !n.read).length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">All caught up!</p>
              </CardContent>
            </Card>
          ) : (
            notifications
              .filter((n) => !n.read)
              .map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Link href={notification.link || "#"}>
                    <Card className="border-0 shadow-sm bg-accent/30 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          {notification.avatar ? (
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getIconBgColor(
                                notification.type,
                              )}`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{notification.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
          )}
        </TabsContent>
      </Tabs>

      <DashboardBottomNav />
    </div>
  )
}
