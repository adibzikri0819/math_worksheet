import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const SCORES_FILE = path.join(__dirname, 'scores.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize scores file if it doesn't exist
async function initializeScoresFile() {
  try {
    await fs.access(SCORES_FILE);
  } catch {
    // File doesn't exist, create it with empty array
    await fs.writeFile(SCORES_FILE, JSON.stringify([]));
  }
}

// Read scores from file
async function readScores() {
  try {
    const data = await fs.readFile(SCORES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    console.error('Error reading scores file');
    return [];
  }
}

// Write scores to file
async function writeScores(scores) {
  try {
    await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
  } catch {
    console.error('Error writing scores to file');
  }
}

// Routes

// Get high scores
app.get('/api/highscores', async (req, res) => {
  try {
    const scores = await readScores();
    // Sort by score descending, then by date ascending (earlier dates first for same score)
    const sortedScores = scores
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(a.date) - new Date(b.date);
      })
      .slice(0, 10); // Top 10 scores
    
    res.json(sortedScores);
  } catch {
    console.error('Error fetching high scores');
    res.status(500).json({ error: 'Failed to fetch high scores' });
  }
});

// Submit a new score
app.post('/api/scores', async (req, res) => {
  try {
    const { name, score } = req.body;
    
    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (typeof score !== 'number' || score < 0 || score > 12) {
      return res.status(400).json({ error: 'Score must be a number between 0 and 12' });
    }
    
    const scores = await readScores();
    
    // Create new score entry
    const newScore = {
      id: Date.now().toString(),
      name: name.trim(),
      score: score,
      percentage: Math.round((score / 12) * 100),
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    scores.push(newScore);
    await writeScores(scores);
    
    res.status(201).json({
      message: 'Score saved successfully',
      score: newScore
    });
  } catch {
    console.error('Error saving score');
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Get all scores (for admin purposes)
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await readScores();
    res.json(scores);
  } catch {
    console.error('Error fetching scores');
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Delete a score (for admin purposes)
app.delete('/api/scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scores = await readScores();
    
    const filteredScores = scores.filter(score => score.id !== id);
    
    if (filteredScores.length === scores.length) {
      return res.status(404).json({ error: 'Score not found' });
    }
    
    await writeScores(filteredScores);
    res.json({ message: 'Score deleted successfully' });
  } catch {
    console.error('Error deleting score');
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  try {
    await initializeScoresFile();
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`High scores API: http://localhost:${PORT}/api/highscores`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\nReceived shutdown signal, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        // eslint-disable-next-line no-process-exit
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (err) {
    console.error('Failed to start server:', err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

startServer();