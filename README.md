# Applications 


This project is an example of a well-structured mono-repo using Yarn Workspaces for building web applications with React, TypeScript, and other related tools.

## Packages

- **my-app**: The main application package built with React, Vite, and TypeScript. It serves as the entry point for the web application.
- **common**: A shared package containing reusable UI layout components and utilities that may be used throughout multiple projects.
- **utilities**: A package containing utility functions/services and helpers used by the application.
- **styles**: A package containing shared styles, including Sass files and CSS modules.


## Getting Started

1. Clone the repository:
   ```shell
   git clone git@github.com:SaherDev/applications.git
   cd applications
 
2. Check out the 'dev' branch:
   ```shell
   git checkout dev
 
3. Install dependencies:
   ```shell
   yarn install

4. Build all packages:
   ```shell
   yarn build
  
5. Start 'my-app' application:
   ```shell
   cd packages/my-app
   yarn dev
   
 
## Development Workflow

Each package can be developed independently and has its own package-specific commands.

   
