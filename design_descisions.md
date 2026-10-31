I need these to be included in the set of my projects - like a blog with a few links, some descriptions etc

Here are the projects:

1. https://the-el-design-house.vercel.app/ - “We do not merely decorate square footage; we choreograph atmosphere, light, and architectural harmony to evoke emotional resonance.”

Founded on the uncompromising pursuit of architectural distinction, The El Design House operates as a bespoke interior design studio catering to discerning homeowners, luxury hospitality operators, and forward-thinking commercial enterprises worldwide.

Our practice is distinguished by taking on only comprehensive, end-to-end commissions. By maintaining absolute control from the initial structural blueprint through fabrication to bespoke joinery, we safeguard the purity of the design vision.

2. https://vercel.com/devcb13ds-projects/carevoice-ai
https://github.com/DeVcB13d/carevoice-ai
Feature	Description
🎙️ Voice-First Interface	Real-time speech-to-text (Deepgram) + text-to-speech (Cartesia) via LiveKit
🤖 AI Video Avatar	Tavus-powered photorealistic doctor avatar responds in video
📅 Calendar Booking	Visual calendar to browse doctors, select slots, book appointments
🔁 Session Memory	Identify by phone number — returning users get their history automatically
📝 Auto Call Summary	AI-generated summary with booked appointments, preferences, and timestamps
🛠️ Live Tool Feedback	Visual on-screen indicator for every agent tool call ("Fetching slots…", "Booking confirmed ✅")
💬 Dual Transcript	Color-coded chat bubbles (you on right, agent on left)
🏗️ Architecture
┌──────────────────────┐         HTTPS          ┌─────────────────────────┐
│   React Frontend     │ ──────────────────────► │  Python Token Server    │
│   (Vite + TS)        │                         │  (aiohttp :8080)        │
└──────────────────────┘                         └──────────┬──────────────┘
         │                                                   │
         │  WebRTC (LiveKit SDK)                    LiveKit Cloud
         │                                                   │
         └─────────────────────────────────────────────────► │
                                                   ┌──────────▼──────────────┐
                                                   │  Python Agent Worker    │
                                                   │  (LiveKit Agents 1.x)   │
                                                   │                         │
                                                   │  STT: Deepgram          │
                                                   │  LLM: OpenAI GPT-4o     │
                                                   │  TTS: Cartesia          │
                                                   │  Avatar: Tavus          │
                                                   └──────────┬──────────────┘
                                                              │ SQLite
                                                   ┌──────────▼──────────────┐
                                                   │  voice_agent.db         │
                                                   │  users · appointments   │
                                                   │  time_slots · summaries │
                                                   └─────────────────────────┘


3. https://github.com/DeVcB13d/crowd_analytics

A high-performance, multi-threaded pipeline for real-time person detection, tracking, and zone-based behavioral analytics. This system uses YOLOv8 for detection, ByteTrack for persistent ID tracking, and a custom analytics engine to monitor occupancy and directional flow in specific regions of interest.

✨ Features
Real-time Detection & Tracking: Powered by YOLOv8 and ByteTrack for robust per-person monitoring.
Zone-Based Analytics: Define multiple polygons (zones) to monitor specific areas like entrances, crosswalks, or platforms.
Directional Flow: Estimates the dominant movement direction (North, South-East, etc.) for people within each zone.
Automated Alerting: Logs alerts to logs/run.log and structured JSON data when zone occupancy exceeds configurable thresholds.
Modern Web Console: A premium Gradio-based interface for live monitoring and system contro

https://github.com/DeVcB13d/crowd_analytics/blob/main/samples/sample_video.mp4
https://github.com/DeVcB13d/crowd_analytics/blob/main/outputs/final_annotated.mp4


Include my experiences in detail:

1. Lejit AI - Iirst AI hire; led development of an agentic RAG platform for legal professionals from prototype to 200+ paying customers.
● Fine-tuned LLMs and built agentic RAG pipelines over Indian case-law databases and court judgments for case-reference
and argument generation.
● Built a multilingual OCR/document-understanding engine to digitize legal documents and automate reference linking.
● Designed and deployed backend services (FastAPI, Node.js) for real-time document indexing and collaborative review (make it more in detail)

2. NTNU:
Project Engineer Aug 2025 – Jan 2026
Norwegian University of Science and Technology (NTNU) Gjøvik, Norway
● Built a multi-sensor welfare-monitoring research system for elderly-care environments, fusing radar (AWR6843AOP
mmWave FMCW), video, floor-pressure, and physiological wearable data across 13 activity classes.
● Designed the experiment pipeline end-to-end: dataset collection and annotation across three rooms in a nursing-home
simulation lab, session-based train/test splits to avoid leakage, and per-class threshold tuning to handle severe class
imbalance.
● Extended a self-supervised detection architecture (Barlow Twins-based, from the 2023 publications) into a real-time
inference pipeline running on consumer-grade GPUs.
● Diagnosed and fixed data-integrity issues in raw sensor captures (split binary formats, session contamination) that were
silently corrupting training data.

