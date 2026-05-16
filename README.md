# Team Task Manager

A full-stack team collaboration app where teams create projects, assign tasks, and track progress with role-based access control.

## Features

- JWT auth (signup, login, persistent sessions)
- Role-based access (admin / member)
- Project management with member assignment and progress tracking
- Tasks with priority, status, due dates, and assignees
- Dashboard with charts and recent activity
- Search and filtering
- Responsive modern UI

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Context API, Recharts
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator
- **Database:** MongoDB (Atlas)
- **Deployment:** Railway

## Folder Structure

```
team-task-manager/
├── backend/      Express API (MVC)
└── frontend/     React + Vite SPA
```

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (use [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Install
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

**`backend/.env`** (copy from `.env.example`)
```
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/team_task_manager
JWT_SECRET=your_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run
```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173. Sign up — the first user can choose the `admin` role.

## MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com.
2. Database Access -> add a user with read/write.
3. Network Access -> allow `0.0.0.0/0` (or Railway egress IPs).
4. Copy the SRV connection string into `MONGO_URI`.

## API Endpoints

### Auth
| Method | Path                | Body                         | Auth |
|--------|---------------------|------------------------------|------|
| POST   | /api/auth/signup    | name, email, password, role  | -    |
| POST   | /api/auth/login     | email, password              | -    |
| GET    | /api/auth/me        | -                            | yes  |
| GET    | /api/auth/users     | -                            | yes  |

### Projects
| Method | Path                  | Auth | Role  |
|--------|-----------------------|------|-------|
| GET    | /api/projects         | yes  | any   |
| POST   | /api/projects         | yes  | admin |
| GET    | /api/projects/:id     | yes  | any   |
| PUT    | /api/projects/:id     | yes  | admin |
| DELETE | /api/projects/:id     | yes  | admin |

### Tasks
| Method | Path                       | Auth | Role           |
|--------|----------------------------|------|----------------|
| GET    | /api/tasks                 | yes  | any            |
| POST   | /api/tasks                 | yes  | admin          |
| PUT    | /api/tasks/:id             | yes  | admin          |
| DELETE | /api/tasks/:id             | yes  | admin          |
| PATCH  | /api/tasks/:id/status      | yes  | admin/assignee |

### Dashboard
| Method | Path                  |
|--------|-----------------------|
| GET    | /api/dashboard/stats  |

## Deployment to Railway

### Backend
1. New Project -> Deploy from GitHub repo -> select `backend/` as root.
2. Set environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=https://<your-frontend>.up.railway.app`
   - `NODE_ENV=production`
3. Build: `npm install` - Start: `npm start` (already in `railway.json`).
4. Generate a domain.

### Frontend
1. New service -> same repo, root = `frontend/`.
2. Set `VITE_API_URL=https://<your-backend>.up.railway.app/api`.
3. Build: `npm install && npm run build` - Start: `npm run preview -- --port $PORT --host 0.0.0.0`.
4. Generate a domain.

After both are live, update `CLIENT_URL` on backend to the frontend domain for CORS.

## Screenshots

> _Add screenshots here._
- `docs/dashboard.png`
- `docs/projects.png`
- `docs/project-details.png`

## Future Improvements

- Real-time updates via WebSockets
- File attachments on tasks
- Email notifications & invites
- Kanban drag-and-drop board
- Activity timeline per project
- Subtasks & comments
- 2FA and OAuth (Google, GitHub)
- Unit and E2E test suites

## License

MIT
