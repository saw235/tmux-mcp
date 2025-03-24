# Tmux MCP (Management Control Program)

A REST API server for managing tmux sessions, windows, and panes. This server provides a programmatic interface to control tmux through HTTP endpoints.

## Features

- Create and manage tmux sessions
- Create and list windows within sessions
- List panes within windows
- Execute commands in specific panes
- Capture pane content
- Track command execution status

## Prerequisites

- Docker and Docker Compose
- Or Node.js 20+ and tmux if running locally

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/saw235/tmux-mcp.git
   cd tmux-mcp
   ```

2. Start the server:
   ```bash
   docker-compose up -d
   ```

The server will be available at http://localhost:3000

## API Endpoints

### Health Check
- GET `/health` - Check if the server is running

### Tmux Status
- GET `/tmux/status` - Check if tmux server is running

### Sessions
- GET `/tmux/sessions` - List all sessions
- POST `/tmux/sessions` - Create a new session
  ```json
  {
    "name": "session-name"
  }
  ```

### Windows
- GET `/tmux/sessions/:sessionId/windows` - List windows in a session
- POST `/tmux/sessions/:sessionId/windows` - Create a new window
  ```json
  {
    "name": "window-name"
  }
  ```

### Panes
- GET `/tmux/windows/:windowId/panes` - List panes in a window
- GET `/tmux/panes/:paneId/content` - Get pane content
  - Query params: `lines` (optional, default: 200)

### Command Execution
- POST `/tmux/panes/:paneId/execute` - Execute a command in a pane
  ```json
  {
    "command": "echo 'hello world'"
  }
  ```
- GET `/tmux/commands/:commandId` - Get command execution status

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start in development mode:
   ```bash
   npm run dev
   ```

## Building from Source

1. Build TypeScript:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## License

MIT