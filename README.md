# ELRICS Patient Management Portal
## Technical Assessment

Welcome to the **ELRICS Patient Management Portal** technical assessment frontend repository. This project is a foundational UI for a modern SaaS healthcare application, designed for candidates to demonstrate their backend engineering and full-stack integration skills.

## Project Overview

This repository contains the complete frontend UI for a Patient Management Dashboard. It has been built using HTML5, CSS3, and Vanilla JavaScript (ES6) without any modern frameworks or build tools to ensure maximum compatibility and simplicity.

The frontend is fully designed and includes layout, styling, and basic DOM interactions (e.g., modals, form validation, toast notifications, loading states). 

However, **there is no backend implementation**. 

Your objective is to complete the application by implementing the required backend services and integrating them with the provided frontend while preserving the existing user interface.

## Time Available

**30 Minutes**

## Folder Structure

```
.
├── README.md
├── .gitignore
├── login.html
├── register.html
├── dashboard.html
├── patients.html
├── assets/
│   ├── logo.svg
│   ├── avatar.png
│   └── icons/
├── css/
│   ├── styles.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── services/
    │   └── api.js
    ├── pages/
    │   ├── login.js
    │   ├── register.js
    │   ├── dashboard.js
    │   └── patients.js
    ├── components/
    │   ├── modal.js
    │   ├── table.js
    │   ├── toast.js
    │   ├── loader.js
    │   └── sidebar.js
    └── utils/
        ├── helpers.js
        ├── validation.js
        └── constants.js
```

## Setup Instructions

Since this is a static frontend project, there are no dependencies to install (no Node.js, no npm required).

1. Clone or download this repository.
2. Open the `patient-management` directory.
3. Serve the HTML files using a static web server.
    - Example using VS Code: Install the **Live Server** extension and click "Go Live" on `login.html`.
    - Example using Python: Run `python -m http.server 8000` in the directory and navigate to `http://localhost:8000`.

## Business Requirements

The hospital requires a secure Patient Management Portal. Authorized administrators should be able to:

1. **Register** to create an initial administrator account.
2. **Log in** to access the dashboard.
3. **View patient records** with relevant medical details.
3. **Register new patients** capturing essential data.
4. **Update patient information** when circumstances change.
5. **Delete patient records** from the system.
6. **Search patients** quickly.

## Functional Requirements

At a minimum, the completed application should support:
- User authentication
- Patient registration
- Viewing patient records
- Editing patient details
- Deleting patient records
- Searching patients
- Appropriate validation
- Appropriate error handling

## Backend Integration

Your backend will run separately from the provided frontend.

Ensure that your frontend is able to communicate successfully with your backend during development.

You are responsible for configuring your application appropriately so that both components function together in your local development environment.

## Submission Guidelines

1. You must integrate this exact frontend with your custom backend.
2. The backend must be implemented using Python, Django, and Django REST Framework.
3. Integrate the provided frontend with your backend implementation while maintaining the existing project structure.

## Deliverables

Submit:
- Source code
- Git repository
- README with setup instructions
- Database migration files
- Environment configuration template (`.env.example` if applicable)

## Assumptions

You may make reasonable assumptions where requirements are not explicitly defined. Document any assumptions in your README.

## General Rules & Expectations

- **Do not modify the overall UI/UX design.** You may add subtle improvements if necessary, but the core aesthetic must remain the same.
- **Complete the application according to the business requirements.** Connect the provided frontend functions to your newly created backend.
- **Initial Administrator:** The application should support creation of the initial administrator account before authentication.
- **Data Persistence:** Ensure that users and patients are properly stored.
- **Authentication:** Secure the application so unauthorized access is rejected.
- **Git Workflow:** Maintain a clean commit history. Use meaningful commit messages that reflect logical development milestones. The repository history may be reviewed during evaluation.

## External Resources

You may use:
- Official documentation
- Search engines
- AI coding assistants
- Personal notes

However, you must be able to explain every technical decision during the technical discussion.

## Evaluation Criteria

Your submission will be evaluated on:
- Code quality
- Project structure
- Problem solving
- Maintainability
- Backend integration
- Error handling
- Data validation
- Security considerations
- API design
- User experience
- Ability to explain technical decisions

Best of luck!
