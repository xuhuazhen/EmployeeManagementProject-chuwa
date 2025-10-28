import app from './app.js';
import connectDB from './config/db.js';

const port = process.env.PORT || 3000;

// make sure the app running after the db has connected successfully.
const startServer = async () => {
  await connectDB(); 
  app.listen(port, () => {
    console.log(`Server is up and running on: http://localhost:${port}`);
  });
};

startServer();
