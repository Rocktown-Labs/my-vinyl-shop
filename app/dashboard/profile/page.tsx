"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-0 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your seller profile and information</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Profile Picture</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Update your profile image</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xl">JD</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Photo
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Display Name
            </Label>
            <Input id="name" placeholder="Your store name" defaultValue="John Doe" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm">
              Username
            </Label>
            <Input id="username" placeholder="@yourusername" defaultValue="@johndoe" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell customers about your store..."
              rows={4}
              defaultValue="Vinyl collector since 2010. Specializing in jazz and soul records."
              className="rounded-xl resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm">
              Location
            </Label>
            <Input id="location" placeholder="City, State" defaultValue="New York, NY" className="h-11 rounded-xl" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button size="lg" className="rounded-full h-12 w-full sm:w-auto">
          Save Changes
        </Button>
        <Button variant="outline" size="lg" className="rounded-full bg-transparent h-12 w-full sm:w-auto">
          Cancel
        </Button>
      </div>
    </div>
  )
}
