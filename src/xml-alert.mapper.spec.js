const fs = require('fs');
const XmlAlertMapper = require('./xml-alert.mapper');
const CapAlert = require('./cap-alert');
const AlertReference = require('./alert-reference');

describe('XmlAlertMapper', () => {

    it('should map xml to CapAlert-Model', () => {
        const mapper = new XmlAlertMapper();
        const xml = fs.readFileSync('src/resources/test/alert.owa.cap.xml', {encoding: 'utf-8'});

        const capAlert = mapper.mapXml(xml);
        console.log(JSON.stringify(capAlert));
        expect(capAlert.originatedAt.toISOString()).toBe((new Date('2019-02-25T06:46:16-00:00')).toISOString());
        expect(capAlert.msgType).toEqual('Alert');
        expect(capAlert.status).toEqual('Actual');
        expect(capAlert.scope).toEqual('Public');
        expect(capAlert.references).toEqual([]);
        expect(capAlert.alertId).toEqual('EXAMPLE-OW-f46bdd9e-146f-4337-abbe-ce1be88d4a0b');
        expect(capAlert.senderId).toEqual('alerts@example.org');
    });

    it('should map Ack-Alert to xml', () => {
        const mapper = new XmlAlertMapper();
        const ackAlert = CapAlert.builder()
        .alertId('ack-id')
        .msgType('Ack')
        .status('Actual')
        .senderId('Ack-Alert-Sender')
        .scope('Public')
        .reference(
            AlertReference.builder()
            .identifier('EXAMPLE-OW-f46bdd9e')
            .senderId('alerts@example.org')
            .sent(new Date('2019-02-25T06:46:16-00:00'))
            .build()
        )
        .build();

        const xml = mapper.mapAlert(ackAlert);

        expect(xml).toContain('<msgType>Ack</msgType>');
        expect(xml).toContain('<references>EXAMPLE-OW-f46bdd9e,alerts@example.org,2019-02-25T06:46:16-00:00</references>');
    });

    it('should map Error-Alert to xml', () => {
        const mapper = new XmlAlertMapper();
        const ackAlert = CapAlert.builder()
        .alertId('ack-id')
        .msgType('Error')
        .note('some problem occured')
        .status('Actual')
        .senderId('Ack-Alert-Sender')
        .scope('Public')
        .reference(
            AlertReference.builder()
            .identifier('EXAMPLE-OW-f46bdd9e')
            .senderId('alerts@example.org')
            .sent(new Date('2019-02-25T06:46:16-00:00'))
            .build()
        )
        .build();

        const xml = mapper.mapAlert(ackAlert);

        expect(xml).toContain('<msgType>Error</msgType>');
        expect(xml).toContain('<note>some problem occured</note>');
        expect(xml).toContain('<references>EXAMPLE-OW-f46bdd9e,alerts@example.org,2019-02-25T06:46:16-00:00</references>');
    });

    it('should throw error if msgType is not Error or Ack', () => {
        const mapper = new XmlAlertMapper();
        const ackAlert = CapAlert.builder()
        .alertId('ack-id')
        .msgType('Alert')
        .status('Actual')
        .senderId('Alert-Sender')
        .scope('Public')
        .reference(
            AlertReference.builder()
            .identifier('EXAMPLE-OW-f46bdd9e')
            .senderId('alerts@example.org')
            .sent(new Date('2019-02-25T06:46:16-00:00'))
            .build()
        )
        .build();

        expect(() => {
            mapper.mapAlert(ackAlert);
        }).toThrow();
    });

    it('should throw error if no reference was given for Ack', () => {
        const mapper = new XmlAlertMapper();
        const ackAlert = CapAlert.builder()
        .alertId('ack-id')
        .msgType('Ack')
        .status('Actual')
        .senderId('Ack-Alert-Sender')
        .scope('Public')
        .build();

        expect(() => {
            mapper.mapAlert(ackAlert);
        }).toThrow();
    });

});