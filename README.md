# User Management Application

A responsive Angular application for managing user data fetched from the RandomUser API. This application allows users to view, add, edit, and delete user information.

## Features

- Fetch and display 100 users from the RandomUser API
- View user details including profile image, full name, email, and country
- Add new users to the list
- Edit existing user information
- Delete users from the list
- Restore original user list
- Responsive design for all device sizes
- Comprehensive test suite (unit and e2e)

## Technologies Used

- Angular 19
- TypeScript
- Tailwind CSS
- Jasmine/Karma (unit testing)
- Playwright (e2e testing)

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16.x or later)
- npm (v8.x or later)

## Installation

1. Clone the repository
```bash
git clone https://github.com/carlostrcs/prueba-tecnica-frontend-angular.git
cd prueba-tecnica-frontend-angular
```

2. Install dependencies
```bash
npm install
```
## Running the Application
To start the development server:
```bash
npm start
```
Then navigate to http://localhost:4200/ in your browser. The application will automatically reload if you change any of the source files.

## Building for Production
To build the application for production:
```bash
npm run build
```
The build artifacts will be stored in the dist/ directory.

## Running Tests
- Unit Tests
  To run unit tests via Karma:
    ```bash
    npm run test:unit
    ```
  To generate a coverage report:
    ```bash
    npm run test:coverage
    ```
    Coverage reports can be found in the src/test/unit/coverage directory.

- End-to-End Tests
  To run e2e tests via Playwright:
  ## Make sure the application is running in another terminal
  ```bash
  npm start
  ```
  ## In a separate terminal
  ```bash
  npm run test:e2e
  ```

  To view the Playwright test report:
  ```bash
  npx playwright show-report src/test/e2e/playwright-report
  ```
# Project Structure
```
src/
├── app/
│   ├── core/                 # Core functionality used across the app
│   │   ├── models/           # Data models and interfaces
│   │   └── services/         # Application-wide services
│   ├── shared/               # Shared components, directives, and pipes
│   │   └── components/       # Reusable components
│   └── app.component.*       # Main application component
└── test/                     # Test reports and e2e tests
```
