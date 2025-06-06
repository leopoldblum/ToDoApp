## Basic Todo App

A simple yet complete full-stack Todo application with user-specific persistent data and smooth transitions.

**Try it here:** [https://todos.leopold-blum.de](https://todos.leopold-blum.de)

###  Tech Stack

**Frontend**  
- React, HTML
- Tailwind CSS
- [TanStack Query](https://tanstack.com/query) for data fetching, optimistic updates and caching
- [Motion](https://motion.dev/) for smooth animations and transitions 

**Backend**  
- Go (Golang) used for REST API 
- PostgreSQL as database

### Features
- Create, read, update, and delete todos
- Optimistic UI updates for a snappy experience
- Smooth animations when interacting with todos
- Responsive design with mobile support
- Darkmode toggle
- Persistent todo storage using ```localStorage``` to save a per-browser userID, with backend ID mapping
- ULID-based todo IDs for easy chronological sorting
