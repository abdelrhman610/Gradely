# Gradely — AI-Powered Assignment Management & Grading Platform

A full-stack web application for automated assignment management with AI-driven grading. Students submit PDF assignments, receive AI-generated feedback and grades, while teachers manage assignments, review submissions, and track progress. An admin panel provides system-wide oversight.

## Tech Stack

**Backend (C# / .NET)**
- ASP.NET Core Web API with Clean Architecture (Domain, Application, Infrastructure, API layers)
- SQL Server + Entity Framework Core
- ASP.NET Identity with JWT authentication (access + refresh token rotation)
- Swagger documentation
- Unit of Work + Generic Repository patterns

**Frontend (Next.js)**
- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 with shadcn/ui-style components
- Radix UI primitives, React Hook Form + Zod
- Recharts for data visualization
- Dark/light theme support

## Key Features

- **Role-based access** — Student, Teacher, Admin dashboards
- **Assignment submission** — PDF upload (max 10MB), stored with GUID filenames
- **AI grading pipeline** — External ML system grades submissions; results stored as reports
- **Rich feedback UI** — Visual score, categorized strengths/improvements, performance bar
- **JWT auth** — Short-lived access tokens with refresh token rotation
- **Fallback mock data** — Frontend works standalone with mock data for development
- **In-app messaging** — Client-side messaging context between students and teachers

## Architecture

```
Backend API (C#)
  Gradely.Domain        — Entities, Enums, Interfaces
  Gradely.Application   — DTOs, Services (business logic)
  Gradely.Infrastructure — DbContext, Repositories, UnitOfWork
  Gradely.Api           — Controllers, Middleware, Config

Frontend (Next.js)
  app/                  — Routes (auth, student, teacher, admin, settings)
  components/           — UI primitives, dashboard cards, forms, feedback display
  lib/                  — API client, auth context, types, mock data
  hooks/                — Custom hooks
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/register` | Register new student |
| `POST /api/auth/login` | Login, returns JWT + refresh token |
| `GET/POST /api/assignments` | List/create assignments |
| `GET/POST /api/submissions` | Upload/list submissions |
| `GET/POST /api/submissions/{id}/report` | View/save grading report |
| `GET /api/student/dashboard` | Student dashboard stats |
| `GET /api/teacher/assignments` | Teacher assignment management |
| `GET /api/admin/users` | Admin user management |

## Getting Started

1. **Backend**: Open `Gradely_Api-master/GradelySolution.sln` in Visual Studio, update connection string in `appsettings.json`, run migrations, and start the API.
2. **Frontend**: Navigate to `student-assignment-portal/`, run `pnpm install && pnpm dev`.
3. Default admin: `admin@gradely.com` / `Admin@123`
