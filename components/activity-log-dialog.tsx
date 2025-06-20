"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

type ActivityLogEntry = {
  id: string
  date: string
  user: {
    name: string
    role: string
    avatar?: string
  }
  message: string
  attachments?: string[]
  isProvider: boolean
}

type ActivityLogDialogProps = {
  providerId: string
  providerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock activity log data
const getMockActivityLog = (providerId: string): ActivityLogEntry[] => {
  return [
    {
      id: "1",
      date: "2023-05-10 09:30 AM",
      user: {
        name: "System",
        role: "Automated",
        avatar: "/abstract-letter-s.png",
      },
      message: "Provider onboarding process initiated.",
      isProvider: false,
    },
    {
      id: "2",
      date: "2023-05-10 10:15 AM",
      user: {
        name: "John Smith",
        role: "Provider",
        avatar: "/javascript-code.png",
      },
      message: "Registration form submitted.",
      isProvider: true,
    },
    {
      id: "3",
      date: "2023-05-11 11:00 AM",
      user: {
        name: "Sarah Lee",
        role: "PNM Verification Officer",
        avatar: "/abstract-sl.png",
      },
      message: "Initial review completed. Please upload your medical license certificate.",
      isProvider: false,
    },
    {
      id: "4",
      date: "2023-05-12 02:30 PM",
      user: {
        name: "John Smith",
        role: "Provider",
        avatar: "/javascript-code.png",
      },
      message: "Medical license certificate uploaded.",
      attachments: ["medical_license.pdf"],
      isProvider: true,
    },
    {
      id: "5",
      date: "2023-05-13 09:45 AM",
      user: {
        name: "Sarah Lee",
        role: "PNM Verification Officer",
        avatar: "/abstract-sl.png",
      },
      message: "Documents verified. Application forwarded to approval team.",
      isProvider: false,
    },
    {
      id: "6",
      date: "2023-05-15 03:15 PM",
      user: {
        name: "David Wong",
        role: "PNM Approval Manager",
        avatar: "/abstract-dw.png",
      },
      message: "Application approved. Welcome to our network!",
      isProvider: false,
    },
  ]
}

export function ActivityLogDialog({ providerId, providerName, open, onOpenChange }: ActivityLogDialogProps) {
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(getMockActivityLog(providerId))
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      const newEntry: ActivityLogEntry = {
        id: `${activityLog.length + 1}`,
        date: new Date().toLocaleString(),
        user: {
          name: "Sarah Lee",
          role: "PNM Verification Officer",
          avatar: "/abstract-sl.png",
        },
        message: newMessage,
        isProvider: false,
      }

      setActivityLog([...activityLog, newEntry])
      setNewMessage("")
      setIsSending(false)
      toast({
        title: "Message sent",
        description: "Your message has been sent to the provider.",
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Activity Log: {providerName}</DialogTitle>
          <DialogDescription>Communication history and status updates</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 my-4 max-h-[50vh]">
          <div className="space-y-6">
            {activityLog.map((entry) => (
              <div key={entry.id} className={`flex gap-4 ${entry.isProvider ? "justify-start" : "justify-end"}`}>
                {entry.isProvider && (
                  <Avatar>
                    <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.name} />
                    <AvatarFallback>{entry.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    entry.isProvider ? "bg-muted" : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{entry.user.name}</span>
                    <span className="text-xs opacity-70">{entry.date}</span>
                  </div>
                  <p className="text-sm">{entry.message}</p>
                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Attachments:</p>
                      <ul className="list-disc pl-4 text-xs space-y-1">
                        {entry.attachments.map((attachment, index) => (
                          <li key={index} className="hover:underline cursor-pointer">
                            {attachment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {!entry.isProvider && (
                  <Avatar>
                    <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.name} />
                    <AvatarFallback>{entry.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" type="button">
              Attach File
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
