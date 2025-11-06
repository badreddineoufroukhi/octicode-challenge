import { initDatabase } from './models/database';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Create and start server
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
