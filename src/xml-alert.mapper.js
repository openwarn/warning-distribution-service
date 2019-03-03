const xmlJs = require('xml-js');
const CapAlert = require('./cap-alert');
const moment = require('moment');

class XmlAlertMapper {

    /**
     * @throws Error
     * @param {string} capXml 
     * @returns {CapAlert}
     */
    mapXml(capXml) {
        const cap = xmlJs.xml2js(capXml, {
            compact: true,
            alwaysArray: true
          });

        if (!Array.isArray(cap.alert) || !cap.alert.length === 1 || !cap.alert[0].msgType){
            console.error('AlertRoute', 'Malformed CAP', cap)
            throw new Error('malformed cap');
        }

        const alert = cap.alert[0]; 
      
        return CapAlert.builder()
            .alertId(alert.identifier[0]._text[0].trim())
            .originatedAt(new Date(alert.sent[0]._text[0].trim()))
            .msgType(alert.msgType[0]._text[0].trim())
            .status(alert.status[0]._text[0].trim())
            .senderId(alert.sender[0]._text[0].trim())
            .scope(alert.scope[0]._text[0].trim())
            .build();
    }

    /**
     * @param {CapAlert} capAlert (Ack and Error only)
     * @returns {string} xml
     */
    mapAlert(capAlert) {
        if (['Error', 'Ack'].indexOf(capAlert.msgType) === -1) {
            throw new Error(`msgType '${capAlert.msgType}' not supported`)
        }

        if (!capAlert.references || capAlert.references.length === 0) {
            throw new Error('alert should contain references');
        }

        const reference = capAlert.references[0];

        const alert = {
            _attributes: {
                xmlns: 'urn:oasis:names:tc:emergency:cap:1.2'
            },
            identifier: {
                _text: capAlert.alertId
            },
            sender: {
                _text: capAlert.senderId
            },
            sent: {
                // use UTC-00:00 as default time zone
                _text: XmlAlertMapper.formatDateTime(capAlert.originatedAt)
            },
            msgType: {
                _text: capAlert.msgType
            },
            status: {
                _text: capAlert.status
            },
            scope: {
                _text: capAlert.scope
            },
            references: {
                _text: `${reference.identifier},${reference.senderId},${XmlAlertMapper.formatDateTime(reference.sent)}`
            }
        }

        if (capAlert.msgType === 'Error') {
            alert.note = capAlert.note;
        }

        return xmlJs.js2xml({
            _declaration: {
                _attributes: {
                    version: '1.0',
                    encoding: 'utf-8'
                }
            },
            alert
        }, {
            compact: true
        });
    }

    /**
     * @param {Date} dateTime 
     */
    static formatDateTime(dateTime) {
        return moment(dateTime).utc(false).format('YYYY-MM-DDThh:mm:ssZ').replace(/\+00:00$/, '-00:00');
    }
}

module.exports = XmlAlertMapper;