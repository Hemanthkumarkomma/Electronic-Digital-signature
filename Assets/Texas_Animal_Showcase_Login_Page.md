# Texas Animal Showcase — Login Page Copilot Prompt

## Objective

Implement **ONLY the Login page** for the existing Texas Animal Showcase application.

The existing project already contains:

- `frontend/`
- `backend/`

Do **not** create a new Angular project or ASP.NET project.

The application has **one role only: Exhibitor**.

Do not create role selection, admin login, staff login, or an "Exhibitor Access Only" section.

## Technology

- Frontend: Angular
- Backend: ASP.NET Core Web API
- Database: Microsoft SQL Server
- ORM: Entity Framework Core
- Authentication: JWT Bearer

Use the versions and architecture already present in the project.

## Scope

For this task, implement only:

1. Login page UI
2. Login form validation
3. Login API
4. SQL Server user lookup
5. Secure password verification
6. JWT generation
7. Angular authentication service
8. Minimum routing required for Login
9. Minimum authenticated placeholder only if required to verify successful login

Do **NOT** implement yet:

- Registration page
- Consent Form
- Digital Signature
- Draw/Type/Upload Signature
- PDF generation
- DOCX generation
- Form Builder
- Admin dashboard
- Staff dashboard
- Role selection

## 1. Inspect the Existing Project

Before making changes:

1. Inspect `frontend/`.
2. Identify the Angular version.
3. Determine whether the project uses standalone components.
4. Inspect existing routing.
5. Inspect existing services.
6. Inspect existing styles.
7. Inspect `backend/`.
8. Identify the ASP.NET Core version.
9. Check whether Entity Framework Core is configured.
10. Check whether SQL Server is configured.
11. Check whether authentication already exists.

Reuse the existing architecture and coding conventions.

Do not unnecessarily restructure the project or delete unrelated functionality.

## 2. Login Page Design

Create a professional Login page closely matching the supplied reference design.

Use a split-screen layout on desktop:

- Left panel: approximately 50%
- Right panel: approximately 50%
- Full viewport height
- Light gray/very light background
- Large rounded main container
- Soft shadow
- No unnecessary navbar
- No footer

## 3. Local Asset Requirement

The Login page visual/image must be stored inside the Angular project's assets folder.

Preferred structure:

```text
frontend/
└── src/
    └── assets/
        └── images/
            └── texas-animal-showcase-login.jpg
```

If the reference image is available in the project/workspace, use/copy it as the local asset.

If it is not available as a file, create a suitable local placeholder asset that can easily be replaced later.

**Do NOT use an external image URL for the main Login background.**

Use the local asset from Angular, for example:

```css
background-image: url('/assets/images/texas-animal-showcase-login.jpg');
background-size: cover;
background-position: center;
```

Adjust the path if required by the existing Angular configuration.

## 4. Left Login Panel

Use the local Texas animal showcase image as the background.

Apply a subtle overlay if required for text readability.

Display:

### TEXAS
### ANIMAL SHOWCASE

Subtitle:

`YOUTH • ANIMALS • OPPORTUNITY`

Main heading:

```text
Building
Tomorrow's
Leaders Today
```

Supporting text:

```text
A platform for exhibitors to complete consent forms and be a part of the Texas Animal Showcase.
```

At the bottom display:

- Safe Events
- Responsible Exhibition
- Brighter Futures

Use simple icons.

The visual style should be warm, professional, and related to Texas/agriculture/animal exhibitions.

## 5. Right Login Panel

Use a clean white background.

At the top-right:

```text
New here?
[ Register ]
```

The Register button should be an outlined button.

**Do not create the Registration page now.**

If a registration route already exists, the button may navigate to it. Otherwise, leave the navigation ready for future implementation without creating the Registration page.

## 6. Login Content

Center the login content vertically.

Heading:

```text
Welcome Back
```

Description:

```text
Log in to your exhibitor account to access your consent forms.
```

### Email

Label:

`Email Address`

Placeholder:

`Enter your email address`

Include an email icon.

Validation:

- Required
- Valid email format

Messages:

```text
Email is required.
Please enter a valid email address.
```

### Password

Label:

`Password`

Placeholder:

`Enter your password`

Include a lock icon.

Add a show/hide password icon that toggles:

```text
password
↔
text
```

Validation:

- Required

Message:

```text
Password is required.
```

## 7. Forgot Password

Display:

`Forgot Password?`

Place it below the password field and align it to the right.

Do not create the Forgot Password page yet.

## 8. Login Button

Create a full-width primary button:

`Login`

Use the blue appearance from the reference.

States:

- Normal
- Hover
- Disabled
- Loading

During login:

`Logging in...`

Disable the button while the API request is running.

## 9. Google Button

Below the Login button:

```text
──────── OR ────────
```

Then:

`Continue with Google`

Use a Google icon.

For now this is UI only.

Do **not** implement Google OAuth unless it already exists in the project.

Do not fake Google authentication.

## 10. IMPORTANT — REMOVE THIS

The Login page must NOT contain:

```text
Exhibitor Access Only
```

Do not create:

- Exhibitor Access Only button
- Exhibitor Access Only card
- Exhibitor Access Only text
- Role selector
- Role dropdown
- Multiple login types

There is only one role:

`Exhibitor`

## 11. Angular Login Component

Use the existing Angular architecture.

If the project uses standalone components, use standalone components.

If appropriate:

```text
frontend/
└── src/
    └── app/
        └── features/
            └── auth/
                └── login/
                    ├── login.component.ts
                    ├── login.component.html
                    └── login.component.css
```

Do not create a second Angular project.

## 12. Angular Reactive Form

Use Angular Reactive Forms if supported by the existing project.

Form fields:

```text
email
password
```

Validate on the frontend.

Do not put direct authentication HTTP implementation inside the component if an AuthService can handle it.

## 13. Angular Auth Service

If an AuthService already exists, reuse it.

Otherwise create:

`auth.service.ts`

Required functionality:

```text
login()
logout()
isAuthenticated()
getCurrentUser()
```

Login API:

```text
POST /api/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Successful response:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "role": "Exhibitor"
  }
}
```

Do not store passwords.

## 14. Login API

Create only:

```text
POST /api/auth/login
```

Use:

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Bearer

Process:

```text
Email + Password
       ↓
Find user by email
       ↓
Verify PasswordHash
       ↓
Generate JWT
       ↓
Return token + user
```

Invalid credentials:

```text
401 Unauthorized
```

Use:

`Invalid email or password.`

Do not reveal whether the email exists.

## 15. User Entity

If a User entity/table already exists, reuse it.

If not, create the minimum required User entity:

```text
Id
FirstName
LastName
Email
PhoneNumber
PasswordHash
Role
CreatedAt
```

Role must always be:

`Exhibitor`

The Login request must not specify or change the role.

Never return `PasswordHash` in API responses.

## 16. Password Security

Never store plaintext passwords.

Use a secure ASP.NET Core password hashing mechanism.

Login must verify the entered password against `PasswordHash`.

Do not implement a custom cryptographic hashing algorithm.

## 17. JWT Configuration

If JWT authentication already exists, reuse it.

Otherwise configure JWT Bearer authentication.

Example:

```json
"Jwt": {
  "Key": "CHANGE_THIS_DEVELOPMENT_KEY",
  "Issuer": "TexasAnimalShowcase",
  "Audience": "TexasAnimalShowcaseUsers",
  "ExpiryMinutes": 60
}
```

Do not hard-code production secrets.

JWT claims should include:

- User ID
- Email
- Role

Role:

`Exhibitor`

## 18. SQL Server

If SQL Server and Entity Framework Core are already configured, reuse the existing configuration.

Otherwise:

```json
"ConnectionStrings": {
  "DefaultConnection": "YOUR_SQL_SERVER_CONNECTION_STRING"
}
```

Do not assume the SQL Server instance name.

Do not hard-code credentials.

Do not perform destructive database operations.

## 19. CORS

If required, configure CORS so Angular can communicate with ASP.NET Core during development.

Typical Angular development URL:

```text
http://localhost:4200
```

Reuse existing CORS configuration if present.

Do not use unrestricted CORS for production.

## 20. Error Handling

Invalid credentials:

```text
Invalid email or password.
```

Network/server problem:

```text
Unable to connect to the server. Please try again.
```

Do not display sensitive backend exception details.

## 21. Routing

Create/use:

```text
/login
```

Do not create these pages/routes now unless they already exist:

```text
/register
/dashboard
/consent
/signature
```

If no authenticated landing page exists, create only the minimum placeholder required to verify successful authentication:

```text
Welcome, [First Name]

You are logged in as an Exhibitor.
```

Do not build Dashboard functionality.

## 22. Responsive Design

Desktop:

```text
┌──────────────────────────┬──────────────────────────┐
│                          │ New here? [Register]     │
│ TEXAS                    │                          │
│ ANIMAL SHOWCASE          │ Welcome Back             │
│                          │                          │
│ Building                 │ Email Address            │
│ Tomorrow's               │ [ Email                ] │
│ Leaders Today            │                          │
│                          │ Password                 │
│ Description              │ [ Password          👁 ] │
│                          │                          │
│ Safe Events              │ Forgot Password?         │
│ Responsible Exhibition   │                          │
│ Brighter Futures         │ [        Login         ] │
│                          │                          │
│                          │ ─────── OR ─────────     │
│                          │                          │
│                          │ [ Continue with Google ] │
└──────────────────────────┴──────────────────────────┘
```

Mobile:

- Stack sections vertically
- Keep the login form usable
- Make inputs full width
- Prevent horizontal scrolling
- Reduce image panel height if necessary

## 23. Accessibility

Use:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Appropriate input types
- Error messages associated with fields

Email:

```html
<input type="email">
```

Password:

```html
<input type="password">
```

## 24. Icons

Reuse an icon library already installed in the project.

Required icons:

- Email
- Lock
- Eye / Eye-off
- Google

Do not install a large new dependency if the project already provides icons.

## 25. Expected File Structure

Approximately:

```text
YourProject/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       └── texas-animal-showcase-login.jpg
│   │   │
│   │   └── app/
│   │       └── features/
│   │           └── auth/
│   │               └── login/
│   │                   ├── login.component.ts
│   │                   ├── login.component.html
│   │                   └── login.component.css
│   │
│   └── package.json
│
└── backend/
    └── existing ASP.NET Core structure
```

Reuse existing files where possible.

## 26. Do Not Over-Implement

This task is ONLY for the Login page.

Do not generate:

- Registration
- Consent Form
- Digital Signature
- Draw Signature
- Type Signature
- Upload Signature
- PDF
- DOCX
- Form Builder
- Admin
- Staff
- Role Selection
- Dashboard functionality

These will be implemented later.

## 27. Final Verification

After implementation:

1. Build the Angular project.
2. Build the ASP.NET Core backend.
3. Fix compilation errors.
4. Verify Login page renders.
5. Verify the local Login image loads from `src/assets`.
6. Verify email validation.
7. Verify password validation.
8. Verify show/hide password.
9. Verify Login API request.
10. Verify invalid credentials.
11. Verify successful authentication.
12. Verify JWT generation.
13. Verify SQL Server configuration.
14. Verify responsive layout.
15. Verify "Exhibitor Access Only" is completely absent.
16. Verify no role selection exists.

## 28. Final Response From Copilot

After completing the implementation, report:

1. Files created
2. Files modified
3. Exact Login image asset path
4. Login API endpoint
5. Database changes
6. JWT configuration
7. SQL Server configuration required
8. Frontend run command
9. Backend run command
10. Any remaining configuration

Do not only describe what should be done.

Inspect the existing project and actually implement the Login page and minimum required Login API functionality.
