"use client"

import * as React from "react"
import {
  PinnedList,
  PinnedListItem,
  PinnedListItems,
  PinnedListLabel,
  PinnedListPinned,
  PinnedListTrigger,
  PinnedListUnpinned,
} from "@animate-ui/react/primitives/pinned-list"
import { PinIcon, PinOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

export {
  PinnedList,
  PinnedListItem,
  PinnedListItems,
  PinnedListLabel,
  PinnedListPinned,
  PinnedListTrigger,
  PinnedListUnpinned,
}

const DEFAULT_ITEMS = [
  { id: "maya_lin", name: "Maya Lin (System Design)", pinned: true },
  { id: "elena_rostova", name: "Elena Rostova (Frontend)", pinned: true },
  { id: "marcus_vance", name: "Marcus Vance (Leadership)", pinned: false },
  { id: "dr_aris_thorne", name: "Dr. Aris Thorne (AI/ML)", pinned: false },
]

export type PinnedItem = (typeof DEFAULT_ITEMS)[number]

function Row({ item }: { item: PinnedItem }) {
  return (
    <PinnedListItem
      id={item.id}
      customTrigger
      className="flex h-12 items-center justify-between rounded-xl bg-accent px-4 text-sm select-none"
    >
      {item.name}
      <PinnedListTrigger
        aria-label={item.pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
        className="-mr-2 flex size-8 items-center justify-center rounded-lg bg-background text-muted-foreground"
      >
        <HugeiconsIcon icon={item.pinned ? PinOffIcon : PinIcon} strokeWidth={2} />
      </PinnedListTrigger>
    </PinnedListItem>
  )
}

export default function PinnedListDemo({
  items: initialItems = DEFAULT_ITEMS,
  className,
}: {
  items?: PinnedItem[]
  className?: string
}) {
  const [items, setItems] = React.useState(initialItems)

  const pinned = items.filter((item) => item.pinned)
  const unpinned = items.filter((item) => !item.pinned)

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    )

  return (
    <PinnedList
      onPinnedChange={toggle}
      className={cn("flex w-full max-w-sm flex-col gap-6", className)}
    >
      <PinnedListPinned>
        <PinnedListLabel
          hide={pinned.length === 0}
          className="mb-2 text-xs font-medium text-muted-foreground"
        >
          Pinned Mentors
        </PinnedListLabel>
        <PinnedListItems className="flex flex-col gap-2">
          {pinned.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </PinnedListItems>
      </PinnedListPinned>
      <PinnedListUnpinned>
        <PinnedListLabel
          hide={unpinned.length === 0}
          className="mb-2 text-xs font-medium text-muted-foreground"
        >
          All Available Mentors
        </PinnedListLabel>
        <PinnedListItems className="flex flex-col gap-2">
          {unpinned.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </PinnedListItems>
      </PinnedListUnpinned>
    </PinnedList>
  )
}
