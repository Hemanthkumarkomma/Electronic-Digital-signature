# Graph Report - ElectronicSignature  (2026-09-22)

## Corpus Check
- 83 files · ~69,593 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 413 nodes · 486 edges · 25 communities (23 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `Texas Animal Showcase — Login Page Copilot Prompt` - 32 edges
2. `ExhibitorRegisterComponent` - 17 edges
3. `AuthService` - 11 edges
4. `ElectronicSignature.API.Models` - 7 edges
5. `Exhibitor` - 7 edges
6. `AuthService` - 7 edges
7. `cdk-drag-drop-practice` - 7 edges
8. `electronic-signature-ui` - 7 edges
9. `CdkDragDropPractice` - 7 edges
10. `ElectronicSignatureUi` - 7 edges

## Surprising Connections (you probably didn't know these)
- `ApplicationDbContext` --references--> `Exhibitor`  [EXTRACTED]
  backend/ElectronicSignature.API/Data/ApplicationDbContext.cs → backend/ElectronicSignature.API/Models/Exhibitor.cs
- `AuthService` --implements--> `IAuthService`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/AuthService.cs → backend/ElectronicSignature.API/Online/Services/Interfaces/IAuthService.cs
- `ExhibitorService` --implements--> `IExhibitorService`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/ExhibitorService.cs → backend/ElectronicSignature.API/Online/Services/Interfaces/IExhibitorService.cs
- `ExhibitorRepository` --implements--> `IExhibitorRepository`  [EXTRACTED]
  backend/ElectronicSignature.API/Data/Repositories/Implementations/ExhibitorRepository.cs → backend/ElectronicSignature.API/Data/Repositories/Interfaces/IExhibitorRepository.cs
- `ExhibitorService` --references--> `IExhibitorRepository`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/ExhibitorService.cs → backend/ElectronicSignature.API/Data/Repositories/Interfaces/IExhibitorRepository.cs

## Import Cycles
- None detected.

## Communities (25 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (25): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, prettier, typescript, vitest (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (26): build, serve, test, builder, configurations, defaultConfiguration, options, development (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (26): build, serve, test, builder, configurations, defaultConfiguration, options, architect (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (19): @angular/cdk, dependencies, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (17): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, rxjs (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (15): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, applicationUrl, commandName (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, prettier, typescript, vitest (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (13): prefix, projectType, root, schematics, sourceRoot, cli, analytics, packageManager (+5 more)

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
Cohesion: 0.14
Nodes (13): cli, analytics, packageManager, prefix, projectType, root, schematics, sourceRoot (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, CdkDragDropPractice, Code scaffolding, Development server, Running end-to-end tests, Running unit tests

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, ElectronicSignatureUi, Running end-to-end tests, Running unit tests

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (9): net10.0, Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0), Microsoft.AspNetCore.OpenApi (10.0.9), Microsoft.Data.SqlClient (6.1.1), Microsoft.EntityFrameworkCore.Design (10.0.12), Microsoft.EntityFrameworkCore.SqlServer (10.0.0), Swashbuckle.AspNetCore (10.2.3), System.IdentityModel.Tokens.Jwt (8.12.0) (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (13): ApplicationDbContext, ModelBuilder, InitialCreate, InitialCreate, ModelBuilder, ApplicationDbContextModelSnapshot, ElectronicSignature.API.Migrations, ElectronicSignature.API.Data (+5 more)

### Community 21 - "ElectronicSignature.API.Models"
Cohesion: 0.09
Nodes (19): ApplicationDbContext, Task, ExhibitorRepository, Task, IExhibitorRepository, AppUser, DateTime, Exhibitor (+11 more)

### Community 22 - ".Login"
Cohesion: 0.09
Nodes (21): AllowAnonymous, Task, AuthController, ExhibitorsController, LoginRequest, DateTime, LoginResponse, RegisterExhibitorRequest (+13 more)

### Community 23 - "exhibitor-register.spec.ts"
Cohesion: 0.10
Nodes (14): authGuard(), API_ENDPOINTS, AuthUser, LoginRequest, LoginResponse, RegisterExhibitorRequest, RegisterExhibitorResponse, AuthService (+6 more)

## Knowledge Gaps
- **166 isolated node(s):** `net10.0`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)`, `Microsoft.AspNetCore.OpenApi (10.0.9)`, `Microsoft.Data.SqlClient (6.1.1)`, `Microsoft.EntityFrameworkCore.Design (10.0.12)` (+161 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ElectronicSignature.API.Data` connect `Community 19` to `ElectronicSignature.API.Models`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ElectronicSignature.API.Models` connect `ElectronicSignature.API.Models` to `Community 19`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `ElectronicSignature.API.Online.Services.Interfaces` connect `.Login` to `ElectronicSignature.API.Models`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `net10.0`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)`, `Microsoft.AspNetCore.OpenApi (10.0.9)` to the rest of the system?**
  _166 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._