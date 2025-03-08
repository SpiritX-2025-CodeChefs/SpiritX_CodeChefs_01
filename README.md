# SpiritX Authentication System

A full-stack authentication system built with Next.js and FastAPI, featuring a modern UI, secure authentication flows, and MongoDB persistence.

## 🚀 Features

- **Modern User Interface**
  - Clean, responsive design with Shadcn UI components
  - Light/dark mode support with system detection
  - Smooth animations and transitions
- **Secure Authentication**
  - User registration with password strength validation
  - Secure login with password hashing
  - Session management with HTTP-only cookies
  - Automatic session validation
- **Robust Architecture**
  - Stateless API with FastAPI
  - MongoDB for data persistence
  - Next.js for frontend with App Router
  - Type-safe API interactions

## 🏗️ Architecture

### Frontend (Next.js)

- Built with Next.js 15 and App Router
- Tailwind CSS for styling
- Shadcn UI component library
- Form validation with React Hook Form and Zod
- API communication with type-safe fetch wrapper

### Backend (FastAPI)

- astAPI for high-performance API endpoints
- MongoDB integration with Motor (async driver)
- Crypt password hashing
- WT-based session management
- Input validation with Pydantic

## 📋 Prerequisites

- Node.js 20.x or higher
- Python 3.10 or higher
- MongoDB 4.x or higher
- npm, yarn, or bun (for frontend)
- uv (for Python dependency management)

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
uv sync
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env file with your MongoDB connection details
```

4. Start the backend server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Configure environment variables:

```bash
cp sample.env .env.local
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

5. Open http://localhost:3000 in your browser.

## 🔐 Security Features

- Password hashing with bcrypt
- HTTP-only cookies for session storage
- HTTPS support for production
- Password strength validation
- Protection against CSRF attacks
- Input validation for all API endpoints

## 🧰 Technologies Used

### Frontend

- Next.js 15
- React 19
- Tailwind CSS 4
- shadcn/ui
- React Hook Form
- Zod
- TypeScript
- Lucide Icons

### Backend

- FastAPI
- Motor (MongoDB async driver)
- Passlib (bcrypt)
- Pydantic
- Python 3.10
