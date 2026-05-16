# Blog Application Frontend

This project is the frontend part of a full-stack MERN (MongoDB, Express, React, Node.js) blog application. It provides a dynamic and responsive user interface for reading, writing, and managing blog posts across different user roles.

## Technology Stack

- React: Library for building user interfaces.
- Vite: Build tool for modern web development.
- Zustand: State management library.
- React Router DOM: Library for routing and navigation.
- Tailwind CSS: Utility-first CSS framework for styling.
- Axios: Promise-based HTTP client for making API requests.
- React Hook Form: Library for handling form states and validation.
- React Hot Toast: Library for notifications.

## Project Flow

The application is structured to handle multiple user roles and a complex data flow:

1. User Authentication:
   - Users can register and log in to the application.
   - Authentication is handled via JWT stored in HTTP-only cookies on the backend.
   - The frontend uses a global store (Zustand) to manage the authentication state and current user information.
   - Protected routes ensure that only authorized users can access specific dashboards.

2. Dashboards and Roles:
   - User Dashboard: General users can browse articles and manage their profiles.
   - Author Dashboard: Authors can create new articles, view their published content, and edit existing posts.
   - Admin Dashboard: Administrators have high-level control over users and content.

3. Article Management:
   - Authors can write articles using a dedicated form.
   - Image uploads are integrated with Cloudinary via the backend.
   - Articles are fetched and displayed dynamically based on their category or ID.

4. State Management and API Interaction:
   - Global state is maintained using Zustand for authentication, loading status, and error handling.
   - Axios is used to communicate with the backend API endpoints.
   - Requests include credentials to handle cookie-based authentication.

## Development Setup

Follow these steps to set up the frontend environment locally:

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A running backend instance (local or remote)

### Installation

1. Clone the repository to your local machine.
2. Navigate to the frontend project directory:
   cd Blog-App-Frontend
3. Install the required dependencies:
   npm install

### Configuration

Ensure the API base URL in the source code points to your running backend server. In this project, the URL is currently configured in src/store/globalStore.js.

For a local setup, you might want to use:
http://localhost:3000

### Running the Application

To start the development server, run:
npm run dev

The application will typically be available at http://localhost:5173.

## Features

- Role-based Access Control (RBAC).
- Dynamic Article Rendering.
- Image Upload Integration.
- Responsive Design with Tailwind CSS.
- Real-time Notifications.
