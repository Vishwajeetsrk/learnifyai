"use client"
  
  import { cn } from "@/lib/utils"
  import {
    PreviewLinkCard as PreviewLinkCardPrimitive,
    PreviewLinkCardImage as PreviewLinkCardImagePrimitive,
    PreviewLinkCardPopup as PreviewLinkCardPopupPrimitive,
    PreviewLinkCardPortal as PreviewLinkCardPortalPrimitive,
    PreviewLinkCardPositioner as PreviewLinkCardPositionerPrimitive,
    PreviewLinkCardTrigger as PreviewLinkCardTriggerPrimitive,
    type PreviewLinkCardImageProps,
    type PreviewLinkCardPopupProps,
    type PreviewLinkCardPositionerProps,
    type PreviewLinkCardProps,
    type PreviewLinkCardTriggerProps,
  } from "@animate-ui/react/primitives/base-ui/preview-link-card"
  
  function PreviewLinkCard(props: PreviewLinkCardProps) {
    return <PreviewLinkCardPrimitive {...props} />
  }
  
  function PreviewLinkCardTrigger(props: PreviewLinkCardTriggerProps) {
    return <PreviewLinkCardTriggerPrimitive {...props} />
  }
  
  function PreviewLinkCardPanel({
    className,
    side = "top",
    sideOffset = 4,
    align = "center",
    alignOffset = 0,
    ...props
  }: PreviewLinkCardPopupProps &
    Pick<
      PreviewLinkCardPositionerProps,
      "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
      <PreviewLinkCardPortalPrimitive>
        <PreviewLinkCardPositionerPrimitive
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          className="isolate z-50"
        >
          <PreviewLinkCardPopupPrimitive
            className={cn(
              "ring-foreground/10 bg-popover z-50 origin-(--transform-origin) overflow-hidden rounded-lg shadow-md ring-1 outline-hidden",
              className
            )}
            {...props}
          />
        </PreviewLinkCardPositionerPrimitive>
      </PreviewLinkCardPortalPrimitive>
    )
  }
  
  function PreviewLinkCardImage({
    className,
    ...props
  }: PreviewLinkCardImageProps) {
    return (
      <PreviewLinkCardImagePrimitive
        className={cn("block", className)}
        {...props}
      />
    )
  }
  
  export {
    PreviewLinkCard,
    PreviewLinkCardTrigger,
    PreviewLinkCardPanel,
    PreviewLinkCardImage,
  }
  
  export default function PreviewLinkCardDemo({
    followCursor = false,
    href = "https://animate-ui.com/docs",
    side = "top",
    sideOffset = 4,
    align = "center",
    alignOffset = 0,
  }: {
    followCursor?: boolean | "x" | "y"
    href?: string
    side?: "top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"
    sideOffset?: number
    align?: "start" | "center" | "end"
    alignOffset?: number
  }) {
    return (
      <p className="text-muted-foreground">
        Read the{" "}
        <PreviewLinkCard href={href} followCursor={followCursor}>
          <PreviewLinkCardTrigger
            target="_blank"
            className="text-foreground underline"
          >
            Animate UI Docs
          </PreviewLinkCardTrigger>
          <PreviewLinkCardPanel
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            target="_blank"
          >
            <PreviewLinkCardImage alt="Animate UI Docs" />
          </PreviewLinkCardPanel>
        </PreviewLinkCard>{" "}
        — hover to preview, click to dive in.
      </p>
    )
  }

