const express = require('express');
const winston = require('winston');
const app = express();
const port = 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const fs = require('fs');
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info({
    message: 'Incoming request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers
  });
  next();
});

const validateNumbers = (num1, num2) => {
  if (isNaN(num1) || isNaN(num2)) {
    return { valid: false, message: 'Parameters must be valid numbers' };
  }
  return { valid: true };
};

app.get('/add', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    const validation = validateNumbers(num1, num2);
    if (!validation.valid) {
      logger.error(`Invalid numbers for addition: ${req.query.num1}, ${req.query.num2}`);
      return res.status(400).json({ error: validation.message });
    }
    
    const result = num1 + num2;
    logger.info(`Addition: ${num1} + ${num2} = ${result}`);
    
    res.json({ operation: 'addition', num1, num2, result });
  } catch (error) {
    logger.error(`Error!!: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/subtract', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    const validation = validateNumbers(num1, num2);
    if (!validation.valid) {
      logger.error(`Invalid numbers for subtraction: ${req.query.num1}, ${req.query.num2}`);
      return res.status(400).json({ error: validation.message });
    }
    
    const result = num1 - num2;
    logger.info(`Subtraction: ${num1} - ${num2} = ${result}`);
    
    res.json({ operation: 'subtraction', num1, num2, result });
  } catch (error) {
    logger.error(`Error!!: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/multiply', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    const validation = validateNumbers(num1, num2);
    if (!validation.valid) {
      logger.error(`Invalid numbers for multiplication: ${req.query.num1}, ${req.query.num2}`);
      return res.status(400).json({ error: validation.message });
    }
    
    const result = num1 * num2;
    logger.info(`Multiplication: ${num1} * ${num2} = ${result}`);
    
    res.json({ operation: 'multiplication', num1, num2, result });
  } catch (error) {
    logger.error(`Error!!: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/divide', (req, res) => {
  try {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    const validation = validateNumbers(num1, num2);
    if (!validation.valid) {
      logger.error(`Invalid numbers for division: ${req.query.num1}, ${req.query.num2}`);
      return res.status(400).json({ error: validation.message });
    }
    
    if (num2 === 0) {
      logger.error('Division by zero attempted');
      return res.status(400).json({ error: 'Cannot divide by zero' });
    }
    
    const result = num1 / num2;
    logger.info(`Division: ${num1} / ${num2} = ${result}`);
    
    res.json({ operation: 'division', num1, num2, result });
  } catch (error) {
    logger.error(`Error!!: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => {
  logger.info(`Calculator microservice listening at http://localhost:${port}`);
});

module.exports = app; 