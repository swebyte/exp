# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application using modern Angular features including standalone components, signals, zoneless change detection, and Server-Side Rendering (SSR) with prerendering. The app is a personal portfolio/blog site with authentication capabilities.

## Common Commands

### Development
- `npm start` or `ng serve` - Start development server on http://localhost:4200/
- `npm run watch` - Build with watch mode for continuous compilation

### Building
- `npm run build` - Production build (outputs to dist/frontend/browser)
- `ng build -c production` - Explicit production build
- `ng build -c development` - Development build with source maps

### Testing
- `npm test` or `ng test` - Run unit tests with Karma
- Tests use Jasmine framework

### Deployment
- `npm run serve:prod` - Serve production build locally on port 8080
- `npm run deploy` - Build for production and deploy to gh-pages

### Code Generation
- `ng generate component component-name` - Generate new component
- `ng generate --help` - List all available schematics

## Architecture

### Modern Angular Stack
- **Angular 20** with standalone components (no NgModules)
- **Zoneless change detection** (`provideZonelessChangeDetection()`) - no Zone.js
- **Signals** for reactive state management throughout the app
- **SSR/Prerendering** configured via `@angular/ssr` with static output mode
- **Component file naming**: Uses short names without `.component` suffix (e.g., `about.ts` not `about.component.ts`)

### Routing
Routes are configured in `src/app/app.routes.ts` using functional routing with lazy-loaded components via `loadComponent()`. All routes use lazy loading for optimal performance.

Server-side rendering behavior is controlled in `src/app/app.routes.server.ts`:
- Static pages (home, blog list, experience, about) use `RenderMode.Prerender`
- Dynamic pages (blog detail with ID) use `RenderMode.Client`

### State Management
Uses Angular signals exclusively for reactive state:
- `signal()` for mutable state
- `computed()` for derived state
- No RxJS subjects for state management

### Authentication System
Authentication is handled via JWT tokens:
- `AuthService` (src/app/services/auth.service.ts) manages auth state using signals
- Token stored in localStorage (browser-only via platform checks)
- `authInterceptor` (src/app/interceptors/auth.interceptor.ts) automatically adds Bearer token to HTTP requests
- Auto-logout on 401 responses
- SSR-safe: All localStorage access is wrapped in `isPlatformBrowser()` checks

### HTTP Communication
- Uses `HttpClient` with functional interceptors
- Base API URL configured in `src/environments/environment.ts`
- Currently points to PostgREST backend API
- All API calls use environment.apiBaseUrl prefix

### Component Structure
Components follow a consistent pattern:
- Use `inject()` for dependency injection (no constructor injection)
- Use `signal()` for component state
- File structure: `component-name/component-name.ts|html|scss`
- Import standalone components directly in component decorators
- Use `protected` for template-accessible members, `private` for internal members

### Styling
- SCSS preprocessing configured globally
- Bootstrap 5 + Bootswatch themes included
- ng-bootstrap for Bootstrap components
- Component-specific styles scoped via Angular's view encapsulation
- Prettier configured with 100 character line width and single quotes

### External Libraries
- **ngx-markdown**: Markdown rendering support (configured in app.config.ts)
- **anime.js**: Animation library (animejs package)
- **ng-bootstrap**: Bootstrap components for Angular
- **marked**: Markdown parser (used by ngx-markdown)

### SSR Considerations
The app is SSR-enabled with prerendering:
- Use `isPlatformBrowser(PLATFORM_ID)` before accessing browser-only APIs (localStorage, window, etc.)
- Main entry: `src/main.ts` (browser)
- Server entry: `src/main.server.ts`
- Server config: `src/app/app.config.server.ts`
- Express server: `src/server.ts`

## Development Notes

### TypeScript Configuration
Strict mode enabled with:
- `strict: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `strictTemplates: true` in Angular compiler options

### File Organization
- Components: `src/app/{component-name}/` with co-located .ts, .html, .scss files
- Services: `src/app/services/`
- Interceptors: `src/app/interceptors/`
- Environments: `src/environments/`

### API Integration Pattern
Components typically:
1. Inject `HttpClient` and `AuthService`
2. Use signals to hold API response data
3. Call API in `ngOnInit()` lifecycle hook
4. Update signals with response data
5. Use `environment.apiBaseUrl` for base URL

Example pattern from blog component:
```typescript
protected posts = signal<BlogPost[]>([]);

ngOnInit() {
  this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/blog`).subscribe({
    next: (data) => this.posts.set(data)
  });
}
```

### Modal Pattern
Uses ng-bootstrap modals:
1. Inject `NgbModal` service
2. Call `modalService.open(ComponentClass, options)`
3. Handle result promise for success/dismissal
4. Refresh data after modal closes

## Git Workflow
- Main branch: `main`
- Modified files should be reviewed before committing (check git status)
