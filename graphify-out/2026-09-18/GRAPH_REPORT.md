# Graph Report - ElectronicSignature  (2026-09-18)

## Corpus Check
- 60 files · ~62,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 321 nodes · 339 edges · 21 communities (20 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `Texas Animal Showcase — Login Page Copilot Prompt` - 32 edges
2. `AuthService` - 9 edges
3. `AuthService` - 7 edges
4. `cdk-drag-drop-practice` - 7 edges
5. `electronic-signature-ui` - 7 edges
6. `CdkDragDropPractice` - 7 edges
7. `ElectronicSignatureUi` - 7 edges
8. `http` - 6 edges
9. `https` - 6 edges
10. `development` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AuthController` --references--> `IAuthService`  [EXTRACTED]
  backend/ElectronicSignature.API/Controllers/AuthController.cs → backend/ElectronicSignature.API/Services/AuthService.cs

## Import Cycles
- None detected.

## Communities (21 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (25): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, prettier, typescript, vitest (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (26): build, serve, test, builder, configurations, defaultConfiguration, options, development (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (32): build, serve, test, builder, configurations, defaultConfiguration, options, architect (+24 more)

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
Cohesion: 0.25
Nodes (7): cli, analytics, packageManager, newProjectRoot, projects, $schema, version

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (6): App, appConfig, routes, Component, DropListPractice, Component

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (36): 10. IMPORTANT — REMOVE THIS, 11. Angular Login Component, 12. Angular Reactive Form, 13. Angular Auth Service, 14. Login API, 15. User Entity, 16. Password Security, 17. JWT Configuration (+28 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (14): App, appConfig, routes, Component, authGuard(), AuthService, AuthUser, LoginRequest (+6 more)

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
Cohesion: 0.25
Nodes (7): net10.0, Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0), Microsoft.AspNetCore.OpenApi (10.0.9), Microsoft.Data.SqlClient (6.0.2), Swashbuckle.AspNetCore (10.2.3), System.IdentityModel.Tokens.Jwt (8.12.0), Microsoft.NET.Sdk.Web

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (18): AllowAnonymous, Task, AuthController, AppUser, LoginRequest, LoginResponse, Task, AuthService (+10 more)

## Knowledge Gaps
- **167 isolated node(s):** `ElectronicSignature.API.Controllers`, `net10.0`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)`, `Microsoft.AspNetCore.OpenApi (10.0.9)`, `Microsoft.Data.SqlClient (6.0.2)` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 4` to `Community 6`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `ElectronicSignature.API.Controllers`, `net10.0`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._