const express = require('express');
const StatusCode = require('statuses');
const XmlAlertMapper = require('../xml-alert.mapper');

function buildAlertRouter(kafkaProducer) {
  const router = express.Router();

  router.post('/', function (req, res) {
    if (!req.body || !req.body.xml) {
      res.sendStatus(StatusCode('Bad Request'));
      return;
    }

    /*
     * Map XML to internal CapAlert model
     */
    const xmlAlertMapper = new XmlAlertMapper();
    const capXml = req.body.xml;
    let capAlert;
    try {
      capAlert = xmlAlertMapper.mapXml(capXml);
    } catch (error) {
      res.sendStatus(StatusCode('Malformed CAP'));
      return;
    }

    /*
     * Validate some simple rules from CAP-OW 1.0
     * TODO: Use Schema-Validation-Service
     */

    // Rule #2: status may not equal 'System'
    const allowedStatus = ['actual', 'exercise', 'test', 'draft'];
    if (allowedStatus.indexOf(capAlert.status.toLowerCase()) === -1) {
      res.json(xmlAlertMapper.mapAlert(capAlert.asError(`status ${capAlert.status} is not allowed`)));
      return;
    }

    /*
     * Pass alert to the message broker (kafka)
     */
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
          console.error('AlertRoute', 'Error while sending message to kafka', err)
          res.sendStatus(StatusCode('Internal Server Error'));
        } else {
          console.log('AlertRoute', 'Message was delivered to broker', data);
          res.json(xmlAlertMapper.mapAlert(capAlert.asAck()));
        }
    });
  });

  return router;
}

module.exports = buildAlertRouter;