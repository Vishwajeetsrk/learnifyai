import asyncio
import edge_tts
import os

SCRIPT_TEXT = (
    "Welcome to Learnify AI. In this masterclass, we explore the core principles of designing "
    "intuitive user interfaces and modern user experience architecture. "
    "Every great product begins with user-centered design. Master visual hierarchy, auto layout, "
    "and interactive prototypes with real-time feedback. "
    "Let's build your next design system right here on Learnify AI."
)

OUTPUT_FILE = "public/videos/lesson-narration.mp3"

async def main():
    print(f"Generating neural voiceover using en-US-ChristopherNeural...")
    communicate = edge_tts.Communicate(
        text=SCRIPT_TEXT,
        voice="en-US-ChristopherNeural",
        rate="+0%",
        pitch="+0Hz"
    )
    await communicate.save(OUTPUT_FILE)
    print(f"Voiceover successfully generated at: {OUTPUT_FILE}")
    size = os.path.getsize(OUTPUT_FILE)
    print(f"File size: {size} bytes")

if __name__ == "__main__":
    asyncio.run(main())
