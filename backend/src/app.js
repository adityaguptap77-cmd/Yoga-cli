const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

function createApp() {
  const app = express();
  app.set('trust proxy', config.isProd ? 1 : false);
  app.disable('x-powered-by');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, hsts: config.isProd }));
  app.use(cors({
    origin(origin, cb) {
      // Same-origin requests and server-to-server calls send no Origin header.
      if (!origin || config.corsOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  }));
  app.use(compression());
  app.use(cookieParser());

  // Uploaded images (blog covers, founder photo). The frontend proxies /uploads to here.
  app.use('/uploads', express.static(config.uploadDir, { maxAge: config.isProd ? '30d' : 0, immutable: config.isProd, fallthrough: false }));

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
