const express = require('express');

function buildAlertRouter(kafkaProducer) {
  const router = express.Router();

  router.post('/', function (req, res) {
    // TODO: garantieren, dass der producer ready ist (producer.on('ready', ..))
    kafkaProducer.send([
        {
            messages: req.body.xml, 
            partition: 0,
            timestamp: Date.now(),
            topic: 'alert'
        }
    ], (err, data) => {
        if (err) {
            throw err;
        }
        
        console.log('KafkaProducer', data);
    });
    res.json('{}');
  });

  return router;
}

module.exports = buildAlertRouter;