"use client"

import React from "react"
import OpenSlotBooking from "@/components/ui/open-slot-booking"

// Sample host busy week and visitor calendar overlay data
const hostWeek = [
  { weekday: 1, from: "09:00", to: "10:30", title: "Architecture Sync" },
  { weekday: 1, from: "14:00", to: "15:00", title: "Meta Review" },
  { weekday: 2, from: "11:30", to: "13:00", title: "Design Sprint" },
  { weekday: 2, from: "16:00", to: "17:00", title: "Staff Office Hours" },
  { weekday: 3, from: "13:00", to: "15:30", title: "Deep Dive Session" },
  { weekday: 4, from: "09:00", to: "09:30", title: "Leadership Standup" },
  { weekday: 4, from: "12:00", to: "13:30", title: "Research Seminar" },
  { weekday: 5, from: "14:30", to: "17:00", title: "Advisory Council" },
]

const myWeek = [
  { weekday: 1, from: "11:00", to: "12:00", title: "Team standup" },
  { weekday: 2, from: "09:00", to: "10:00", title: "Gym & Workout" },
  { weekday: 3, from: "10:00", to: "11:30", title: "Frontend Crit" },
  { weekday: 4, from: "14:00", to: "15:00", title: "1:1 with Manager" },
  { weekday: 5, from: "10:30", to: "12:00", title: "Sprint Retro" },
]

export function OpenSlotBookingDemo() {
  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      <OpenSlotBooking
        hostBusy={hostWeek}
        visitorEvents={myWeek}
        host={{
          name: "Dr. Vikram Aditya",
          role: "Principal Systems Architect, Ex-Google / Meta",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          stamp: "Verified Coach · Learnify AI · ",
          platform: "google-meet",
        }}
        meetingTitle="1-on-1 Engineering & Career Strategy"
        bookingUrl="learnifyai.in/coach/vikram-aditya"
        headline="Skip the endless DMs."
        headlineAccent="Reserve real face-to-face coaching."
        description="Book your high-impact session with a verified industry veteran. Real-time calendar syncing, multi-platform video rooms (Google Meet & Zoom), and automated calendar invitations."
      />
    </div>
  )
}

export default OpenSlotBookingDemo
