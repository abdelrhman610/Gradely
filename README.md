# Gradely — AI-Powered Assignment Management & Grading Platform

A full-stack web application for automated assignment management with AI-driven grading. Students submit PDF assignments and receive AI-generated feedback and grades. Teachers manage assignments, review submissions, and track student progress. An admin panel provides system-wide oversight.

---

## Tech Stack

### Backend (C# / .NET 8)
- **ASP.NET Core Web API** with Clean Architecture (Domain, Application, Infrastructure, API layers)
- **SQL Server** + **Entity Framework Core** for data persistence
- **ASP.NET Core Identity** + **JWT** authentication with access/refresh token rotation
- **Swagger / Swashbuckle** for API documentation
- **Unit of Work** + **Generic Repository** patterns

### Frontend (Next.js)
- **Next.js 16** / **React 19** / **TypeScript**
- **Tailwind CSS 4** with **shadcn/ui**-style components
- **Radix UI** primitives, **React Hook Form** + **Zod** validation
- **Recharts** for data visualization (dashboard charts)
- **next-themes** for dark/light mode support
- **pnpm** as package manager

### Infrastructure
- **Docker** & **Docker Compose** for containerized deployment
- **SQL Server 2022** container with persistent volume storage

---

## Key Features

- **Role-based dashboards** — Separate views for Students, Teachers, and Admins
- **Assignment submission** — PDF upload (max 10 MB), stored with GUID-based filenames
- **AI grading pipeline** — External ML system grades submissions; structured reports stored per submission
- **Rich feedback UI** — Visual score, categorized strengths/improvements, performance bar chart
- **JWT authentication** — Short-lived access tokens with secure refresh token rotation
- **User management** — Admin panel for managing users and roles
- **In-app messaging** — Client-side messaging context between students and teachers
- **Fallback mock data** — Frontend can work standalone with mock data for development
- **Responsive design** — Works across desktop and tablet

---

## Architecture

```
Backend (.NET Clean Architecture)
┌─────────────────────────────────────────────────────┐
│  Gradely.Api          — Controllers, Middleware      │
│  Gradely.Application  — DTOs, Services, Business    │
│  Gradely.Infrastructure — DbContext, Repos, Identity │
│  Gradely.Domain       — Entities, Enums, Interfaces  │
└─────────────────────────────────────────────────────┘

Frontend (Next.js App Router)
┌─────────────────────────────────────────────────────┐
│  app/                 — Routes (auth, student, etc.) │
│  components/          — UI primitives, cards, forms  │
│  lib/                 — API client, auth, types      │
│  hooks/               — Custom React hooks            │
│  styles/              — Global styles                 │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Gradely/
├── Gradely_Api-master/          # .NET Backend
│   ├── Gradely.Api/             # API layer
│   ├── Gradely.Application/     # Application services
│   ├── Gradely.Domain/          # Domain entities
│   ├── Gradely.Infrastructure/  # Data access & identity
│   ├── Dockerfile               # Backend container image
│   └── GradelySolution.sln      # Solution file
│
├── student-assignment-portal/   # Next.js Frontend
│   ├── app/                     # App router pages
│   ├── components/              # UI components
│   ├── lib/                     # Utilities & API client
│   ├── hooks/                   # Custom hooks
│   ├── Dockerfile               # Frontend container image
│   └── package.json             # Dependencies
│
├── docker-compose.yml           # Orchestrates all services
└── README.md
```

---

## Getting Started

### Option 1: Run with Docker (Recommended)

**Prerequisites:** Docker and Docker Compose installed.

```bash
# Clone the repository
git clone https://github.com/your-org/Gradely.git
cd Gradely

# Start all services (SQL Server, API, Frontend)
docker compose up -d

# Wait ~30s for SQL Server to be healthy, then:
# - Frontend:  http://localhost:3001
# - Backend:   http://localhost:5121
# - Swagger:   http://localhost:5121/swagger
```

**Default credentials:**
| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Admin   | admin@gradely.com   | Admin@123   |

The `docker-compose.yml` defines three services:

| Service      | Image                                | Port    | Description                        |
|-------------|--------------------------------------|---------|------------------------------------|
| `sqlserver` | `mcr.microsoft.com/mssql/server:2022-latest` | `1433`  | SQL Server with auto-healthcheck   |
| `api`       | Built from `Gradely_Api-master/Dockerfile`   | `5121`  | ASP.NET Core Web API               |
| `frontend`  | Built from `student-assignment-portal/Dockerfile` | `3001`  | Next.js frontend                   |

Data persists in a named Docker volume (`sqlserver-data`).

#### Docker Compose Environment Variables

The API connects to SQL Server via the connection string set in `docker-compose.yml`:
```yaml
ConnectionStrings__DefaultConnection: "Server=sqlserver,1433;Database=GradelyDb;User Id=sa;Password=Gradely@Pass123;TrustServerCertificate=true;"
```

The frontend uses `NEXT_PUBLIC_API_URL` to point at the API:
```yaml
NEXT_PUBLIC_API_URL: "http://localhost:5121"
```

### Option 2: Run without Docker

#### Backend

```bash
# Prerequisites: .NET 8 SDK, SQL Server
cd Gradely_Api-master

# Update the connection string in appsettings.json

# Apply EF Core migrations
dotnet ef database update

# Run the API
dotnet run --project Gradely.Api

# Swagger available at http://localhost:5121/swagger
```

#### Frontend

```bash
# Prerequisites: Node.js 22+, pnpm
cd student-assignment-portal

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Frontend available at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint                              | Auth   | Description                     |
|--------|---------------------------------------|--------|----------------------------------|
| POST   | `/api/auth/register`                  | ✗      | Register a new student           |
| POST   | `/api/auth/login`                     | ✗      | Login, returns JWT + refresh     |
| GET    | `/api/auth/me`                        | JWT    | Get current user profile         |
| POST   | `/api/auth/refresh`                   | ✗      | Refresh access token             |
| GET    | `/api/assignments`                    | JWT    | List assignments                 |
| POST   | `/api/assignments`                    | Teacher| Create an assignment             |
| GET    | `/api/assignments/{id}`               | JWT    | Get assignment details           |
| GET    | `/api/submissions`                    | JWT    | List submissions                 |
| POST   | `/api/submissions`                    | Student| Upload a PDF submission          |
| GET    | `/api/submissions/{id}`              | JWT    | Get submission details           |
| GET    | `/api/submissions/{id}/report`       | JWT    | View grading report              |
| POST   | `/api/submissions/{id}/report`       | Teacher| Save grading report              |
| GET    | `/api/student/dashboard`             | Student| Student dashboard stats          |
| GET    | `/api/teacher/assignments`           | Teacher| Teacher assignment management    |
| GET    | `/api/admin/users`                   | Admin  | Admin user management            |
| DELETE | `/api/submissions/{id}`              | JWT    | Delete a submission              |

---

## Environment Variables

### Backend (`appsettings.json`)

| Key                                      | Description                      |
|------------------------------------------|----------------------------------|
| `ConnectionStrings:DefaultConnection`    | SQL Server connection string     |
| `Jwt:Secret`                             | JWT signing secret               |
| `Jwt:Issuer`                             | JWT issuer                       |
| `Jwt:Audience`                           | JWT audience                     |

### Frontend

| Variable               | Default                  | Description            |
|------------------------|--------------------------|------------------------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:5121`  | Backend API base URL   |

---

## Development

### Backend Migrations

```bash
cd Gradely_Api-master
dotnet ef migrations add MigrationName --project Gradely.Infrastructure --startup-project Gradely.Api
dotnet ef database update --project Gradely.Infrastructure --startup-project Gradely.Api
```

### Frontend Build

```bash
cd student-assignment-portal
pnpm build        # Production build
pnpm lint         # Run ESLint
```