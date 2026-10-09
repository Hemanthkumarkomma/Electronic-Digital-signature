# Graph Report - ElectronicSignature  (2026-09-30)

## Corpus Check
- 120 files · ~321,194 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 632 nodes · 897 edges · 42 communities (37 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 19
- CLAUDE.md
- ElectronicSignature.API.Models
- .Login
- exhibitor-register.spec.ts
- ExhibitorRegisterComponent
- ConsentFormsController
- Exhibitor
- OpenConsentFormComponent
- .RegisterAsync
- ConsentPdfService
- junior-consent-form.component.ts
- ElectronicSignature.API.Online.DTOs.Auth
- JuniorConsentFormComponent
- Exhibitor
- ConsentService
- app.routes.ts
- AuthService
- .Login

## God Nodes (most connected - your core abstractions)
1. `TemplateFiller` - 47 edges
2. `Texas Animal Showcase — Login Page Copilot Prompt` - 32 edges
3. `DigitalSignatureComponent` - 21 edges
4. `ConsentFormsController` - 16 edges
5. `ExhibitorRegisterComponent` - 16 edges
6. `OpenConsentFormComponent` - 15 edges
7. `AuthService` - 14 edges
8. `JuniorConsentFormComponent` - 13 edges
9. `ConsentService` - 12 edges
10. `ElectronicSignature.API.Models` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ApplicationDbContext` --references--> `Exhibitor`  [EXTRACTED]
  backend/ElectronicSignature.API/Data/ApplicationDbContext.cs → backend/ElectronicSignature.API/Models/Exhibitor.cs
- `ExhibitorRepository` --implements--> `IExhibitorRepository`  [EXTRACTED]
  backend/ElectronicSignature.API/Data/Repositories/Implementations/ExhibitorRepository.cs → backend/ElectronicSignature.API/Data/Repositories/Interfaces/IExhibitorRepository.cs
- `AuthService` --references--> `IExhibitorRepository`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/AuthService.cs → backend/ElectronicSignature.API/Data/Repositories/Interfaces/IExhibitorRepository.cs
- `TemplateFiller` --references--> `ConsentForm`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/ConsentPdfService.cs → backend/ElectronicSignature.API/Models/ConsentForm.cs
- `AuthController` --references--> `IAuthService`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Controllers/AuthController.cs → backend/ElectronicSignature.API/Online/Services/Interfaces/IAuthService.cs

## Import Cycles
- None detected.

## Communities (42 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (25): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, prettier, typescript, vitest (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (39): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (39): build, serve, test, builder, configurations, defaultConfiguration, options, architect (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (19): @angular/cdk, dependencies, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): DateTime, Dictionary, TemplateFiller, Body, bool, Drawing, Func, GeneratedRegex (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (42): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, rxjs (+34 more)

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (6): App, appConfig, routes, Component, DropListPractice, Component

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (36): 10. IMPORTANT — REMOVE THIS, 11. Angular Login Component, 12. Angular Reactive Form, 13. Angular Auth Service, 14. Login API, 15. User Entity, 16. Password Security, 17. JWT Configuration (+28 more)

### Community 10 - "Community 10"
Cohesion: 0.36
Nodes (4): App, appConfig, routes, Component

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (7): ANIMAL_TYPES, SAFETY_GUIDELINES, STEPS, ConsentShellComponent, Component, Input, Output

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, CdkDragDropPractice, Code scaffolding, Development server, Running end-to-end tests, Running unit tests

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, ElectronicSignatureUi, Running end-to-end tests, Running unit tests

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (10): net10.0, DocumentFormat.OpenXml (3.5.1), Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0), Microsoft.AspNetCore.OpenApi (10.0.9), Microsoft.Data.SqlClient (6.1.1), Microsoft.EntityFrameworkCore.Design (10.0.12), Microsoft.EntityFrameworkCore.SqlServer (10.0.0), Swashbuckle.AspNetCore (10.2.3) (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.05
Nodes (21): MigrationBuilder, ModelBuilder, InitialCreate, InitialCreate, MigrationBuilder, ModelBuilder, AddConsentForms, AddConsentForms (+13 more)

### Community 21 - "ElectronicSignature.API.Models"
Cohesion: 0.19
Nodes (8): AppUser, ElectronicSignature.API.Online.Services.Interfaces, ElectronicSignature.API.Models, ElectronicSignature.API.Online.Services.Implementations, ElectronicSignature.API.Data.Repositories.Interfaces, ElectronicSignature.API.Data, ElectronicSignature.API.Controllers, ElectronicSignature.API.Data.Repositories.Implementations

### Community 22 - ".Login"
Cohesion: 0.16
Nodes (10): AuthController, ExhibitorsController, RegisterExhibitorRequest, RegisterExhibitorResponse, Task, ExhibitorRegistrationResult, IExhibitorService, ControllerBase (+2 more)

### Community 23 - "exhibitor-register.spec.ts"
Cohesion: 0.10
Nodes (13): API_ENDPOINTS, AuthUser, LoginRequest, LoginResponse, RegisterExhibitorRequest, RegisterExhibitorResponse, AuthService, Injectable (+5 more)

### Community 24 - "ExhibitorRegisterComponent"
Cohesion: 0.13
Nodes (5): DigitalSignatureComponent, Component, Input, Output, ViewChild

### Community 25 - "ConsentFormsController"
Cohesion: 0.12
Nodes (20): ApplicationDbContext, DateTime, ConsentForm, CancellationToken, Dictionary, HttpPost, IActionResult, IConfiguration (+12 more)

### Community 26 - "Exhibitor"
Cohesion: 0.27
Nodes (5): ConsentForm, fillRequiredFields(), form(), MySubmissionsComponent, Component

### Community 28 - ".RegisterAsync"
Cohesion: 0.29
Nodes (6): Task, IExhibitorRepository, PasswordHasher, Task, ExhibitorService, HashSet

### Community 29 - "ConsentPdfService"
Cohesion: 0.24
Nodes (9): CancellationToken, ILogger, Task, ConsentPdfService, int, SemaphoreSlim, string, SupportedOSPlatform (+1 more)

### Community 30 - "junior-consent-form.component.ts"
Cohesion: 0.20
Nodes (6): ANIMAL_TYPES, SAFETY_GUIDELINES, STEPS, IMPORTANT:, SignatureMethod, SignatureResult

### Community 31 - "ElectronicSignature.API.Online.DTOs.Auth"
Cohesion: 0.22
Nodes (6): LoginRequest, DateTime, LoginResponse, Task, IAuthService, ElectronicSignature.API.Online.DTOs.Auth

### Community 37 - "Exhibitor"
Cohesion: 0.31
Nodes (5): ApplicationDbContext, Task, ExhibitorRepository, DateTime, Exhibitor

### Community 39 - "app.routes.ts"
Cohesion: 0.36
Nodes (3): authGuard(), RegistrationSuccessComponent, Component

### Community 40 - "AuthService"
Cohesion: 0.38
Nodes (4): IConfiguration, PasswordHasher, Task, AuthService

### Community 41 - ".Login"
Cohesion: 0.53
Nodes (4): AllowAnonymous, HttpPost, IActionResult, Task

## Knowledge Gaps
- **173 isolated node(s):** `net10.0`, `DocumentFormat.OpenXml (3.5.1)`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)`, `Microsoft.AspNetCore.OpenApi (10.0.9)`, `Microsoft.Data.SqlClient (6.1.1)` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TemplateFiller` connect `Community 4` to `ConsentFormsController`, `ConsentPdfService`, `ElectronicSignature.API.Models`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `ElectronicSignature.API.Data` connect `ElectronicSignature.API.Models` to `Community 19`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `ElectronicSignature.API.Online.Services.Interfaces` connect `ElectronicSignature.API.Models` to `.Login`, `ElectronicSignature.API.Online.DTOs.Auth`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `net10.0`, `DocumentFormat.OpenXml (3.5.1)`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._