import cors from 'cors';
import express from 'express';
import subscriptionRoute from '../src/route/subscription.route.js';

const app = express();



app.use(cors());
app.use(express.json());



app.get('/', (_, res) => {
  res.send('SubSentry API running');
});

// Health check endpoint
app.get('/api/health', (_, res) => {
  console.log('Health check route hit');
  res.status(200).json({
    success: true,
    message: 'SubSentry API is healthy',
    timestamp: new Date().toISOString(),
  });
});


// Subscription routes
app.use('/api/subscriptions', subscriptionRoute);

// ==================== 404 Handler ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ==================== Error Handler ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry found',
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

 


  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
