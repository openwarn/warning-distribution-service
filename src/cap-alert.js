const AlertReference = require('./alert-reference');

class CapAlert {

    constructor() {
        this.references = [];
        this.originatedAt = new Date();
    }

    static builder() {
        return new AlertBuilder();
    }

    /**
     * @returns {AlertReference}
     */
    asReference() {
        return AlertReference.builder()
        .identifier(this.identifier)
        .senderId(this.senderId)
        .sent(this.originatedAt)
        .build();
    }

    /**
     * @param {string} errorMessage 
     * @returns {CapAlert} Error Alert
     */
    asError(errorMessage) {
        return CapAlert.builder()
        .msgType('Error')
        .status('Actual')
        .scope('Public')
        .originatedAt(new Date())
        .note(errorMessage)
        .senderId('OW-Internal')
        .reference(this.asReference())
        .build();
    }

    /**
     * @returns {CapAlert} Ack Alert
     */
    asAck() {
        return CapAlert.builder()
        .msgType('Ack')
        .status('Actual')
        .scope('Public')
        .originatedAt(new Date())
        .senderId('OW-Internal')
        .reference(this.asReference())
        .build();
    }    
}

class AlertBuilder {
    constructor() {
        this.alert = new CapAlert();
    }

    alertId(identifier) {
        this.alert.alertId = identifier;
        return this;
    }

    senderId(identifier) {
        this.alert.senderId = identifier;
        return this;
    }

    scope(scope) {
        this.alert.scope = scope;
        return this;
    }

    status(status) {
        this.alert.status = status;
        return this;
    }

    msgType(type) {
        this.alert.msgType = type;
        return this;
    }

    note(note) {
        this.alert.note = note;
        return this;
    }

    originatedAt(dateTime) {
        this.alert.originatedAt = dateTime;
        return this;
    }

    /**
     * @param {AlertReference} singleReference 
     */
    reference(singleReference) {
        this.alert.references.push(singleReference);
        return this;
    }

    build() {
        return this.alert;
    }
}


module.exports = CapAlert;