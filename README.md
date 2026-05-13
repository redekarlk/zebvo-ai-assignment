# AI Website Builder

A full-stack Software-as-a-Service (SaaS) platform that empowers users to generate, edit, and publish professional business websites instantly using the power of AI (Google Gemini). 

![Hero Image Placeholder](https://via.placeholder.com/1200x600.png?text=AI+Website+Builder+Dashboard)

---

## 1. Project Overview

Building a website from scratch can be daunting, time-consuming, and expensive for small business owners. The **AI Website Builder** solves this problem by completely automating the website creation process. 

Users simply provide a brief description of their business, and the application leverages advanced generative AI (Google Gemini 1.5-flash) to instantly generate a complete, structured, and customized website. The platform features a real-time visual editor, allowing users to tweak content, switch themes, preview across multiple devices (Desktop/Tablet/Mobile), and instantly publish their site to a public URL or export the raw source code.

---

## 2. Architecture

The application is built on a robust MERN-like stack, utilizing Next.js for the frontend and Node.js/Express for the backend.

- **Frontend Architecture**: Built with **Next.js (App Router)** and **Tailwind CSS**. State management is handled globally using **Zustand**, allowing seamless real-time synchronization between the visual editor sidebar and the live preview iframe.
- **Backend Architecture**: A **Node.js/Express.js** REST API secured by **JSON Web Tokens (JWT)**. It features an abstracted service layer pattern separating controllers from business logic (e.g., AI generation, ZIP compilation).
- **Database Architecture**: **MongoDB** with **Mongoose** ORM. Data is heavily denormalized into dynamic JSON structures (specifically for website `sections`) to ensure maximum flexibility for AI outputs without rigid schema constraints.
- **AI Workflow**: Integrates the **Google Gemini SDK**. The backend constructs highly structured prompts to enforce strict JSON responses representing distinct web components (Hero, About, Services, FAQ, CTA).

---

## 3. Folder Structure

### Frontend (`/frontend`)
```
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── dashboard/        # Protected Dashboard
│   ├── login/            # Auth Routes
│   ├── project/          # Editor & Preview Routes
├── components/           # React Components
│   ├── auth/             # Login/Signup forms
│   ├── common/           # Toasts, Skeletons, Empty States
│   ├── dashboard/        # Project grids and cards
│   ├── editor/           # Sidebar, Theme Editor, Toolbars
│   ├── preview/          # Website Renderer & Section UI
├── lib/                  # Axios interceptors & Constants
├── services/             # API interaction layer
└── store/                # Zustand state management
```

### Backend (`/backend`)
```
src/
├── config/               # Database & AI configurations
├── controllers/          # Route handlers (Auth, Project, AI, Export)
├── middleware/           # JWT Auth & Error Handling
├── models/               # Mongoose Schemas (User, Project)
├── prompts/              # Engineering prompts for Gemini
├── routes/               # Express routing definitions
├── services/             # Core business logic (AI parsing, ZIP creation)
├── utils/                # HTML Generators & Async Handlers
└── server.js             # Application entry point
```

---

## 4. Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-website-builder
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ai-website-builder
   JWT_SECRET=your_super_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   CLIENT_URL=http://localhost:3000
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
   ```
   Start the frontend server:
   ```bash
   npm run dev
   ```

---

## 5. API Documentation

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user & receive JWT |
| GET | `/api/auth/me` | Fetch currently authenticated user |

### Project Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Fetch all user projects |
| POST | `/api/projects` | Create a new blank project |
| GET | `/api/projects/:id` | Fetch specific project details |
| PUT | `/api/projects/:id` | Update project configuration |
| DELETE | `/api/projects/:id` | Delete a project |
| POST | `/api/projects/:id/publish` | Generate public slug and publish |
| GET | `/api/projects/public/:slug` | Public read-only access (No auth) |

### AI Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-website` | Generate full website JSON from business context |
| POST | `/api/ai/regenerate-section` | Rewrite a specific targeted section |

### Export Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exports/:projectId/html` | Download raw HTML string |
| GET | `/api/exports/:projectId/json` | Download raw configuration JSON |
| GET | `/api/exports/:projectId/zip` | Download complete ZIP bundle |

---

## 6. Database Schema Overview

### User Model
- `name` (String): User's full name.
- `email` (String, Unique): Authentication identifier.
- `password` (String): Bcrypt hashed password.

### Project Model
- `userId` (ObjectId): Reference to the creator.
- `name` (String): Internal project identifier.
- `businessInfo` (Object): Context used for AI generation (name, category, target audience, tone, services).
- `theme` (Object): Customization tokens (Primary color, Secondary color, Font family).
- `seo` (Object): Metadata tags for `<head>`.
- `sections` (Array of Objects): The core structural blocks of the website.
- `status` (String): Default `draft`, transitions to `published`.
- `slug` (String, Unique): Public URL identifier.

---

## 7. AI Workflow

1. **Context Gathering**: The user inputs business details (e.g., "A modern bakery in NY targeting vegans").
2. **Prompt Engineering**: The backend injects this context into a strictly defined system prompt (`website.prompt.js`).
3. **LLM Generation**: Google Gemini 1.5-flash processes the prompt and returns a complex, highly structured JSON array representing web components.
4. **Validation & Fallback**: The backend strips formatting, parses the JSON, and validates it against a required schema (Hero, About, Services, FAQ, CTA). If the AI hallucinates, a deterministic fallback generator takes over to ensure the user never faces a hard error.

---

## 8. Frontend Rendering Workflow

The application operates on a "Configuration-Driven UI" model:
1. The AI returns an array of section objects: `{ type: 'hero', props: { headline: '...', ... } }`.
2. The `WebsiteRenderer.jsx` iterates over the `sections` array in real-time.
3. For each item, `SectionRenderer.jsx` dynamically mounts the corresponding React component (`<HeroSection>`, `<AboutSection>`, etc.) and passes the `props` object to it.
4. If a user edits text in the `SectionEditor` sidebar, Zustand immediately updates the global state, triggering an instant re-render of the preview component without network latency.

---

## 9. Export Workflow

- **HTML Generation**: The backend utility `htmlGenerator.js` iterates over the stored JSON array and maps each `type` to a raw HTML template string, injecting CSS variables and SEO meta tags.
- **ZIP Compilation**: When the user requests a ZIP, the `export.service.js` utilizes the `archiver` package. It streams the dynamically generated `index.html`, constructs a `styles.css` file based on theme preferences, adds a `README.md`, and bundles the raw `data.json`. The archive is piped directly to the client's browser as a stream, minimizing memory footprint.

---

## 10. Future Enhancements

- **Drag-and-Drop Editor**: Implementing `react-beautiful-dnd` to allow users to visually reorder sections.
- **Team Collaboration**: Adding real-time multi-player editing via WebSockets/Yjs.
- **One-Click Deployment**: Integrating with Vercel or AWS APIs to deploy the generated HTML directly to a live server.
- **Custom Domains**: Allowing users to bind their own domains via CNAME records instead of standard generated slugs.

---

## 11. Assignment Mapping

This project maps directly to **Option 2: Build an AI-powered SaaS Application**:
- **Core Requirement**: Next.js Frontend & Node/Express Backend.
- **Core Feature**: Integrated Google Gemini API to generate complex UI structures.
- **SaaS Component**: Multi-tenant architecture with user authentication, isolated projects, and a dashboard.
- **Bonus**: Theme customization, Section regeneration, Export (HTML/ZIP), and Public URLs.

---

## 12. Screenshots Section

| Dashboard | Visual Editor |
|-----------|---------------|
| ![Dashboard](https://via.placeholder.com/600x400.png?text=Dashboard+View) | ![Editor](https://via.placeholder.com/600x400.png?text=Visual+Editor) |

| AI Generation Flow | Export Options |
|--------------------|----------------|
| ![AI Flow](https://via.placeholder.com/600x400.png?text=AI+Generation) | ![Exports](https://via.placeholder.com/600x400.png?text=Export+Dropdown) |

---

## 13. Author Information

**Lokesh Redekar**  
*B.Tech CSE, Ajeenkya DY Patil University, Pune*

Developed as part of a full-stack engineering assignment focusing on AI integration, system architecture, and modern web application standards.
