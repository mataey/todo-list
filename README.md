# React Todo List Application

A professional, responsive Todo List application built with React and Vite. The application includes user authentication, protected routes, full CRUD functionality, todo filtering, client-side validation, responsive styling, and accessible user interactions.

## Live Demo

The application is not currently deployed. Deployment to Vercel is optional for this assignment.

## Features

* **User Authentication**

  * Login with user credentials
  * Protected Todo and Profile routes
  * Logout functionality
  * CSRF token handling for authenticated requests

* **Todo Management**

  * Create new todos
  * View existing todos
  * Mark todos as completed or active
  * Edit existing todos
  * Delete todos with confirmation

* **Todo Filtering**

  * View all todos
  * View active todos
  * View completed todos
  * Filter state is reflected in the URL

* **Input Validation**

  * Prevents empty todo submissions
  * Maximum length validation for todo titles
  * Email and password validation on login
  * Clear error messages for invalid input

* **Responsive Design**

  * Responsive layouts for desktop, tablet, and mobile devices
  * Touch-friendly controls
  * Mobile-friendly navigation and forms
  * Responsive todo item layout

* **Accessibility**

  * Semantic HTML elements
  * Labels for form controls
  * Keyboard focus indicators
  * Accessible error and loading messages
  * Appropriate ARIA attributes

* **User Feedback**

  * Loading state while todos are being fetched
  * Error messages for failed operations
  * Empty states when there are no matching todos
  * Disabled states for unavailable actions

## Technologies Used

* React 19
* React Router
* Vite
* JavaScript (ES6+)
* CSS
* ESLint
* Git and GitHub
* Vercel configuration for optional production deployment

## Project Structure

```text
src/
├── components/
│   └── RequireAuth.jsx
├── contexts/
│   └── AuthContext.jsx
├── features/
│   ├── Logoff.jsx
│   ├── Logon.jsx
│   └── Todos/
│       ├── TodoForm.jsx
│       ├── TodoListItem.jsx
│       └── TodoList/
│           └── TodoList.jsx
├── pages/
│   ├── AboutPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── ProfilePage.jsx
│   └── TodosPage.jsx
├── shared/
│   ├── Header.jsx
│   ├── Navigation.jsx
│   └── StatusFilter.jsx
├── App.jsx
├── App.css
└── index.css
```

## Screenshots

### Desktop View

Add a screenshot of the application running on a desktop viewport here.

`![Desktop View](screenshots/desktop.png)`

### Mobile View

Add a screenshot of the application running on a mobile viewport here.

`![Mobile View](screenshots/mobile.png)`

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

* Node.js
* npm
* Git

### Installation

1. Clone the repository.

```bash
git clone https://github.com/mataey/todo-list.git
```

2. Navigate to the project directory.

```bash
cd todo-list
```

3. Install the project dependencies.

```bash
npm install
```

### Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at the local address shown by Vite in the terminal.

## Available Scripts

### `npm run dev`

Starts the Vite development server for local development.

### `npm run build`

Creates an optimized production build.

```bash
npm run build
```

### `npm run preview`

Runs the production build locally for testing.

```bash
npm run preview
```

### `npm run lint`

Runs ESLint to check the project source code.

```bash
npm run lint
```

## Design Decisions

### Styling

The application uses organized CSS in `App.css` and `index.css` to create a consistent visual system across the application.

The styling focuses on:

* Consistent spacing and typography
* Clear visual hierarchy
* Readable text and sufficient contrast
* Responsive layouts
* Button and input states
* Keyboard focus indicators
* Mobile-friendly controls
* Clear completed-todo styling

Responsive media queries are used to adapt the layout for smaller screens.

### Component Organization

The application is divided into reusable React components and pages. Todo-related functionality is grouped under the `features/Todos` directory, while shared navigation and layout components are located in the `shared` directory.

### Authentication

Authentication state is managed through `AuthContext`. Protected routes use the `RequireAuth` component so that authenticated-only pages cannot be accessed without a valid authentication token.

### State Management

Todo state is managed in `TodosPage` using React's `useReducer` hook. This keeps the state transitions for fetching, creating, updating, and deleting todos organized and predictable.

### URL-Based Filtering

Todo filtering uses URL search parameters. This allows the current filter state to be represented in the browser URL and makes navigation between All, Active, and Completed views consistent.

### Security and Validation

Client-side validation is applied before user input is submitted to the API. Todo titles have maximum length limits, empty submissions are prevented, and login fields are validated before authentication requests are made.

Authenticated API requests include the CSRF token required by the backend.

## Vercel Deployment

Deployment to Vercel is optional for this assignment.

The project includes a `vercel.json` configuration file that provides API rewrites for production. The rewrite allows relative `/api/*` requests from the frontend to be forwarded to the Code the Dream backend when deployed.

For local development, the Vite configuration provides the development proxy.

## Testing

Before submission, the application was tested locally for:

* User login
* Protected routes
* Todo creation
* Todo completion and uncompletion
* Todo editing
* Todo deletion
* Todo filtering
* Input validation
* Loading states
* Error states
* Empty states
* Responsive styling
* Keyboard focus states
* Production build

The production build can be verified with:

```bash
npm run build
```

## Future Improvements

Possible future improvements include:

* Adding automated unit and integration tests
* Adding a dark/light theme switcher
* Adding drag-and-drop todo reordering
* Adding offline support or PWA functionality
* Improving task sorting and search functionality
* Adding additional profile settings
* Expanding automated accessibility testing

## License

This project is available under the MIT License.

## Contact

GitHub: `mataey`

## Assignment

This project was completed as part of the Code the Dream Intro to Programming curriculum, Lesson 11.

The Lesson 11 project focuses on transforming the Todo application into a polished, responsive, accessible, and portfolio-ready React application while maintaining authentication, routing, CRUD functionality, validation, and production deployment configuration.
