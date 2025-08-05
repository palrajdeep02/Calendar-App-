import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// File path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventsFile = path.join(__dirname, 'events.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(eventsFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).send('Failed to read events.');
  }
});

// POST new event
app.post('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(eventsFile, 'utf-8');
    const events = JSON.parse(data);
    const newEvent = { id: Date.now(), ...req.body };
    events.push(newEvent);
    await fs.writeFile(eventsFile, JSON.stringify(events, null, 2));
    res.json(newEvent);
  } catch {
    res.status(500).send('Error adding event.');
  }
});

// PATCH update event
app.patch('/api/events/:id', async (req, res) => {
  try {
    const data = await fs.readFile(eventsFile, 'utf-8');
    const events = JSON.parse(data);
    const index = events.findIndex(e => String(e.id) === req.params.id);
    if (index === -1) return res.status(404).send('Event not found');

    events[index] = { ...events[index], ...req.body };
    await fs.writeFile(eventsFile, JSON.stringify(events, null, 2));
    res.json(events[index]);
  } catch {
    res.status(500).send('Error updating event.');
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const data = await fs.readFile(eventsFile, 'utf-8');
    let events = JSON.parse(data);
    events = events.filter(e => String(e.id) !== req.params.id);
    await fs.writeFile(eventsFile, JSON.stringify(events, null, 2));
    res.json({ success: true });
  } catch {
    res.status(500).send('Error deleting event.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
