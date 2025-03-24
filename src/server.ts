import express from 'express';
import * as tmux from './tmux';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Check if tmux is running
app.get('/tmux/status', async (req, res) => {
  try {
    const running = await tmux.isTmuxRunning();
    res.json({ running });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List all sessions
app.get('/tmux/sessions', async (req, res) => {
  try {
    const sessions = await tmux.listSessions();
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new session
app.post('/tmux/sessions', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Session name is required' });
    }
    const session = await tmux.createSession(name);
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List windows in a session
app.get('/tmux/sessions/:sessionId/windows', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const windows = await tmux.listWindows(sessionId);
    res.json(windows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new window in a session
app.post('/tmux/sessions/:sessionId/windows', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Window name is required' });
    }
    const window = await tmux.createWindow(sessionId, name);
    res.json(window);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List panes in a window
app.get('/tmux/windows/:windowId/panes', async (req, res) => {
  try {
    const { windowId } = req.params;
    const panes = await tmux.listPanes(windowId);
    res.json(panes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Execute command in a pane
app.post('/tmux/panes/:paneId/execute', async (req, res) => {
  try {
    const { paneId } = req.params;
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }
    const commandId = await tmux.executeCommand(paneId, command);
    res.json({ commandId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get command execution status
app.get('/tmux/commands/:commandId', async (req, res) => {
  try {
    const { commandId } = req.params;
    const status = await tmux.checkCommandStatus(commandId);
    if (!status) {
      return res.status(404).json({ error: 'Command not found' });
    }
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get pane content
app.get('/tmux/panes/:paneId/content', async (req, res) => {
  try {
    const { paneId } = req.params;
    const lines = req.query.lines ? parseInt(req.query.lines as string) : 200;
    const content = await tmux.capturePaneContent(paneId, lines);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});