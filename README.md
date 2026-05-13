# AI Website Builder (SaaS)

A high-performance, full-stack SaaS platform that leverages **Google Gemini** and **Cloudinary** to instantly generate, customize, and publish professional business websites.

![AI Website Builder Dashboard](https://via.placeholder.com/1200x600.png?text=AI+Website+Builder+Premium+Dashboard)

---

## 🚀 1. Project Overview

The **AI Website Builder** is designed to bridge the gap between business ideas and a professional web presence. By combining advanced LLMs with a dynamic design system, it allows users to create high-conversion websites in seconds.

### Core Value Proposition:
- **Zero-to-Launch in 60 Seconds**: Simply describe your business, and the AI generates everything from copy and themes to high-quality images.
- **2-Step AI Generation**: 
    1. **Brand Strategy**: AI determines the visual identity, color palettes, and typography.
    2. **Content Architecture**: AI builds a logical 8-section conversion funnel (AIDA model).
- **Cloud-Optimized Storage**: Uses **Cloudinary** to serve high-performance, optimized images, keeping the database lightweight and fast.

---

## 🛠️ 2. Tech Stack & Architecture

Built with modern web standards for speed, scalability, and maintainability.

- **Frontend**: **Next.js 15+ (App Router)**, **Tailwind CSS**, **Framer Motion**, and **Zustand** for real-time editor state management.
- **Backend**: **Node.js (Express)** with a service-oriented architecture.
- **AI Engine**: **Google Gemini 1.5-flash** for structural JSON generation and **Imagen 4.0** for visual asset creation.
- **Database**: **MongoDB** (denormalized JSON storage for flexible site structures).
- **Storage**: **Cloudinary SDK** for automated image hosting and optimization.
- **Design System**: A custom-built, monochromatic-first system supporting glassmorphism, fluid typography (`clamp()`), and responsive layouts.

---

## 📂 3. Folder Structure

### Frontend (`/frontend`)
```
src/
├── app/                  # Next.js App Router (Dashboard, Auth, Editor)
├── components/           # UI Component Library
│   ├── dashboard/        # Project Management & Templates
│   ├── editor/           # Real-time Visual Sidebar & Toolbars
│   ├── preview/          # Iframe-based Website Renderer
│   ├── common/           # Monochromatic Design System (Skeletons, Modals)
├── store/                # Zustand (Global Editor & Auth State)
├── hooks/                # Custom React Hooks (Auth, Editor Interaction)
```

### Backend (`/backend`)
```
src/
├── config/               # DB, AI, and Cloudinary Configurations
├── controllers/          # Business Logic Handlers
├── models/               # Mongoose Schemas (User, Project)
├── services/             # Core Services (AI, Cloudinary, Export)
├── utils/                # HTML Engine & JSON Parsers
├── prompts/              # Highly Engineered Prompts for Gemini
```

---

## ⚙️ 4. Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key
- Cloudinary Account (Cloud Name, API Key, API Secret)

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Backend Configuration (`backend/.env`)**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Frontend Configuration (`frontend/.env.local`)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run Locally**
   - **Backend**: `npm run dev`
   - **Frontend**: `npm run dev`

---

## ✨ 5. Key Features

- **Live Visual Editor**: Edit text and images directly with a real-time side-by-side preview.
- **Birds-Eye Preview**: 70% zoom mode in the editor to visualize full-page layouts effectively.
- **Responsive Navigation**: Full mobile menu toggle and fluid typography for all generated sites.
- **Migration Suite**: Built-in scripts to migrate legacy Base64 data to Cloudinary storage.
- **One-Click Deployment**: Instant generation of public URLs for live sharing.
- **Multi-Format Export**: Download your site as a structured JSON or a complete ZIP (HTML/CSS).

---

## 🧬 6. AI & Image Workflow

1. **Prompt Engineering**: Uses structured multi-step prompting to ensure AI returns valid, production-ready JSON.
2. **Dynamic Font Engine**: Automatically parses the AI's typography choices and injects the corresponding Google Fonts dynamically.
3. **Image Pipeline**: AI-generated images or SVG fallbacks are piped directly to **Cloudinary**, ensuring fast load times and minimal database overhead.

---

## 🎯 7. Assignment Mapping

This project fulfills **Option 2: Build an AI-powered SaaS Application**:
- ✅ **Full-Stack Implementation**: Next.js & Node/Express.
- ✅ **Advanced AI Integration**: Structured JSON generation via Gemini.
- ✅ **Optimized Storage**: Cloudinary integration for large asset management.
- ✅ **Premium UI/UX**: Monochromatic design, fluid typography, and responsive mobile views.
- ✅ **SaaS Features**: Auth, Dashboard, Project Persistence, and Export/Publishing.

---

## 👤 8. Author

**Lokesh Redekar**  
*B.Tech CSE, Ajeenkya DY Patil University, Pune*

Developed with a focus on AI-driven system architecture, modern web standards, and high-fidelity user experiences.
