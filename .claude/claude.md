## Project Overview

This is a SaaS backend project for building a smart personal budgeting system.
This project is a SaaS backend designed to help users manage their personal finances by recording transactions, analyzing spending patterns, and gaining better insights into their financial habits.

---

## Tech Stack

This project is built with:

- Typescript
- Expres JS
- Prisma
- Jest


---

## Architecture Pattern

This project follows a layered architecture with separation of concerns. The layers include:

### 1. Routing
Path: `/BUDGETING/src/presentation/routes/index.ts` and  `BUDGETING/src/presentation/routes/health.route.ts` (if route for health groups)
Responsible for registering HTTP routes.


Always implement middleware and authentication on all routes, except for sign-in and sign-up. Whenever a `user_id` is required in any database attribute, it should use the ID of the currently authenticated user.



### 2. DTO (Data Transfer Object)
Used to standardize and structure request and response data, ensuring consistency across the application.

### 3. Handler
Each feature has its own handler.

Examples:
- Health route : `BUDGETING/src/presentation/routes/health.route.ts`

### 4. Entity
Represents the data structure that maps to the database schema.  
Used in the use case and repository layers.

### 5. Controller
Contains all business logic required to run task management features.  
Each feature has its own use case.


Example:
- auth controller: `/BUDGETING/src/presentation/controllers/authController.ts`

### 6. Repository
Responsible for interacting with the database.  
Uses Prisma depending on query complexity.


### 7. Testing 
testing for all fiture include unit testing and integration testing
when generated code solution is done 

---

## Key Commands

- `npm run dev` → Run service in development mode
- `npm run build` → build service in for preparing production
- `npm run start` -----

---

## Important Caveats

- Never run migrations up or down  without proper approvel review.

- Always perform analysis and understand the context before modifying any feature.

- When fixing or enhancing features, do not disrupt existing code or workflows unless necessary and approved.

- Always provide a complete explanation of flow changes after implementing code updates.


