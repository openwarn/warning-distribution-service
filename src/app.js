
const express = require('express');
const noCache = require('nocache');
const requestLogger = require('morgan');
const ConfigurationService = require('./services/configuration.service');
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KafkaClient = kafka.KafkaClient;
const environment = require('process').env;
// Security
const helmet = require('helmet');
const cors = require('cors');

const alertRouterFactory = require('./routes/alert');
const healthRouterFactory = require('./routes/health');
const defaults = require('./defaults');

function initKafkaProducer(config) {
  console.info('Producer is connecting to kafka at:', config.KAFKA_HOST);
  const kafkaClient = new KafkaClient({kafkaHost: config.KAFKA_HOST});
  
  return new Producer(kafkaClient);
}

function buildConfig(defaultConfig, env) {
  const configurationService = new ConfigurationService(defaultConfig, env);

  return configurationService.loadConfiguration();
}

function initApp() {
  const config = buildConfig(defaults, environment);

  const app = express();
  app.use(express.json({ limit: config.MAX_XML_SIZE }))
  app.use(helmet());
  app.use(noCache());
  app.use(cors());

  app.use(requestLogger('dev'));

  const kafkaProducer = initKafkaProducer(config);

  // Routes
  app.use('/api/v1/alerts', alertRouterFactory(kafkaProducer));
  app.use('/health', healthRouterFactory());

  return { app, config };
}

function startApp() {
  const { app, config } = initApp();
  app.listen(config.PORT, () => {
    console.log('listening on *:' + config.PORT);
  });
}

module.exports = {
  start: startApp,
  init: initApp
}