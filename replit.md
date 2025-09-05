# Overview

This is a corporate website for Devtri Seczone Private Limited, a company offering security, manpower, and IT services. The application features a frontend-focused architecture with HTML pages for different services, a basic visitor counter system, and an admin panel for content management. The website uses a dark-themed design and includes contact forms and review management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application follows a traditional multi-page website structure built with HTML, CSS, and vanilla JavaScript. The main navigation includes a responsive Bootstrap-based navbar with dropdown menus for different service categories. The design uses a dark theme with blue accents, implemented through custom CSS variables and Bootstrap 5 components.

Key pages include:
- Main landing page (index.html)
- About page
- Service-specific pages (security, manpower, consistency, payroll, staffing)
- Admin panel for content management
- Flash news page for announcements

The frontend uses Font Awesome icons, Google Fonts (Poppins), and implements smooth animations and hover effects for enhanced user experience.

## Backend Architecture
The backend is built with Node.js and Express.js, serving as a lightweight API server. The architecture separates concerns with dedicated endpoints for visitor counting and contact form handling. The server uses PostgreSQL for data persistence and implements basic CRUD operations for visitor tracking and contact management.

The main server (server.js) handles:
- Static file serving for the frontend
- Database connection management with connection pooling
- API endpoints for visitor counting and contact forms
- Automatic table creation and initialization

## Data Storage
The application uses PostgreSQL as the primary database, hosted on Neon (a serverless Postgres service). The database schema includes:
- `contacts` table for storing contact form submissions
- `visitors` table for tracking visitor counts

Database operations are handled through the `pg` library with proper connection pooling for performance and reliability. The system implements automatic table creation on startup if tables don't exist.

## Authentication and Authorization
Currently, the application appears to have a basic admin panel (admin.html) but does not implement robust authentication mechanisms in the provided backend code. The admin functionality seems to be frontend-only at this stage.

# External Dependencies

## Third-party Services
- **Neon Database**: PostgreSQL hosting service for data persistence
- **Bootstrap 5**: CSS framework for responsive design and UI components
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Typography service (Poppins font family)

## NPM Dependencies
- **Express.js**: Web application framework for Node.js
- **pg**: PostgreSQL client for Node.js database operations
- **body-parser**: Middleware for parsing request bodies
- **dotenv**: Environment variable management
- **openai**: OpenAI API integration (though not actively used in current implementation)

## CDN Resources
- Bootstrap CSS and JavaScript components
- Font Awesome icon library
- Google Fonts for custom typography

The application is designed to be deployed on platforms like Vercel or similar static hosting services, with the backend API handling dynamic functionality.