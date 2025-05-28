# Cleartext Frontend

A modern, responsive web interface for the Cleartext API built with Next.js 15. This frontend provides an intuitive user experience for text processing tasks including summarization, rewriting, and language detection with real-time feedback and keyboard shortcuts.

## ✅ Features

- [x] **Text Summarization** - Generate short or long summaries of any text
- [x] **Text Rewriting** - Transform text into simple or formal styles
- [x] **Language Detection** - Automatically detect the language of input text
- [x] **Real-time Processing** - Async operations with loading states and progress indicators
- [x] **Rate Limiting** - Built-in rate limit awareness with user feedback
- [x] **Keyboard Shortcuts** - Power user features with `Ctrl+/` shortcut panel
- [x] **Responsive Design** - Mobile-first design that works on all devices
- [x] **Dark/Light Theme** - System-aware theme switching
- [x] **Error Handling** - Comprehensive error states with user-friendly messages
- [x] **Input Validation** - Client-side validation with helpful feedback

## 📦 Tech Stack

- **Next.js 15** - React framework with App Router and Server Actions
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Full type safety and developer experience
- **Tailwind CSS 4** - Utility-first CSS framework with modern features
- **ShadCN UI** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Toast notifications with elegant animations
- **next-themes** - System-aware theme management
- **pnpm** - Fast, disk space efficient package manager

## 🔧 Local Setup

### Prerequisites

- Node.js 22+ (recommended: 22+)
- pnpm (recommended) or npm/yarn
- Access to the Cleartext API backend

### Installation

```bash
# Clone the repository
git clone git@github.com:Eventyret/cleartext-fe.git
cd cleartext-fe

# Install dependencies
pnpm install
#or
npm install --legacy-peer-deps
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
API_BASE_URL=http://localhost:8000
API_KEY=your-api-key-here-which-matches-the-backend-you-are-running

# Optional: Development settings
NODE_ENV=development
```

#### ⚠️ Important: Runtime Environment Variables

**Environment variables are required at runtime, not build time.** The application needs these variables to connect to the API backend:

### Development Server

```bash
# Start the development server with Turbopack
pnpm dev

# Alternative commands
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Deployment

### Docker Support

The application includes a multi-stage Dockerfile optimized for production deployment with security best practices.

#### Quick Start with Docker

```bash
# Build the production image
docker build -t cleartext-fe .

# Run the container with required environment variables
docker run -p 3000:3000 \
  -e API_BASE_URL=http://localhost:8000 \
  -e API_KEY=your-api-key-here \
  cleartext-fe
```

#### Production Deployment

For production environments:

```bash
# Build with specific tag
docker build -t cleartext-fe:v1.0.0 .

# Run with production configuration
docker run -d \
  --name cleartext-fe \
  --restart unless-stopped \
  -p 3000:3000 \
  -e API_BASE_URL=https://your-api-domain.com \
  -e API_KEY=your-production-api-key \
  --memory=512m \
  --cpus=1 \
  cleartext-fe:v1.0.0
```

### Traditional Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Cloud Deployment

The Docker image can be deployed to various cloud platforms:

- **AWS ECS** - Works great with our multi-stage Dockerfile
- **Google Cloud Run** - Easy container deployment, auto-scales well
- **Azure** - Simple container setup, good for small teams
- **DigitalOcean** - Straightforward deployment from Git or Docker
- **Railway** - Super quick setup, handles env vars nicely

## 🎯 Usage

### Text Summarization

1. Enter your text in the summarization section
2. Choose between "short" or "long" summary length
3. Click "Summarize" or use `Ctrl+Enter`
4. View the generated summary with copy functionality

### Text Rewriting

1. Input text in the rewriting section
2. Select "simple" or "formal" style
3. Process the text to get a rewritten version
4. Copy the result or make further edits

### Language Detection

1. Paste text in the language detection area
2. Automatically detect the language
3. View confidence scores and language codes

### Keyboard Shortcuts

- `Ctrl + /` - Open keyboard shortcuts panel
- `Ctrl + Enter` - Submit active form
- `Escape` - Close modals and panels

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── SummarizeSection.tsx
│   ├── RewriteSection.tsx
│   ├── LanguageDetectSection.tsx
│   ├── KeyboardShortcuts.tsx
│   └── ...
├── actions/              # Server Actions
│   ├── summerize.ts
│   ├── rewrite.ts
│   └── language-detect.ts
└── lib/                  # Utilities and helpers
    ├── api-helpers.ts    # API integration utilities
    ├── rate-limit.ts     # Rate limiting logic
    └── utils.ts          # General utilities
```

## 🔐 Security Features

- **Input Validation** - Validates all user input on both client and server
- **XSS Protection** - Prevents malicious code injection by sanitizing inputs
- **Rate Limiting** - Tracks and enforces API usage limits
- **Error Boundaries** - Catches and handles errors gracefully
- **Type Safety** - Uses TypeScript to prevent runtime errors

## Design System

Our design system focuses on simplicity and usability:

- Clean, neutral colors with blue accents for important actions
- Standard system fonts optimized for readability
- Whitespace based on 8px units for visual rhythm
- Common UI patterns that users already understand
- Minimal motion that helps rather than distracts

## 🧪 API Integration

Our frontend integrates with the Cleartext FastAPI backend using Next.js Server Actions:

- **Type-Safe Server Actions** - Server-side API calls with full TypeScript validation
- **Error Handling** - Handles API errors and displays helpful messages
- **Rate Limiting** - Client-side rate limit tracking with proactive notifications
- **Response Caching** - Next.js caching with automatic revalidation

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Enhanced layouts for tablet screens
- **Desktop Experience** - Full-featured desktop interface
- **Touch Friendly** - Accessible touch targets and gestures

## 🔧 Development

### Code Quality

```bash
# Lint the codebase
pnpm lint
```

### Component Development

The project uses ShadCN UI components which can be added via:

```bash
# Add new components
npx shadcn@latest add [component-name]
```

## 🤝 Backend Integration

This frontend is designed to work with the [Cleartext API](../cleartext-api). Ensure the backend is running and accessible at the configured `API_BASE_URL`.

Required backend endpoints:

- `POST /summarize` - Text summarization
- `POST /rewrite` - Text rewriting
- `POST /language-detect` - Language detection

## 📊 Performance

- **Core Web Vitals** - Optimized for excellent user experience
- **Bundle Size** - Minimized with tree shaking and code splitting
- **Loading States** - Skeleton loaders and progress indicators
- **Caching** - Efficient API response caching

## 🧠 Architecture Decisions

- **Server Actions** - Chosen for type safety and simplified data fetching
- **Component Composition** - Modular, reusable component architecture
- **State Management** - React state with Server Actions for data mutations
- **Styling** - Tailwind CSS for rapid development and consistency
- **Accessibility** - WCAG 2.1 AA compliance with Radix UI primitives
