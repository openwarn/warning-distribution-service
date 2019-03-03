class AlertReference {
    /**
     * @param {string} identifier 
     * @param {string} senderId 
     * @param {Date} sent 
     */
    constructor(identifier, senderId, sent) {
        // NOTE: Use builder to create an alert reference
        this.identifier = identifier;
        this.senderId = senderId;
        this.sent = sent;
    }

    static builder() {
        return new AlertReferenceBuilder();
    }
}

class AlertReferenceBuilder {
    constructor() {
        this.reference = new AlertReference();
    }

    identifier(identifier) {
        this.reference.identifier = identifier;
        return this;
    }

    senderId(senderId) {
        this.reference.senderId = senderId;
        return this;
    }

    /**
     * @param {DateTime} sent
     */
    sent(sent) {
        this.reference.sent = sent;
        return this;
    }

    build() {
        return this.reference;
    }
}

module.exports = AlertReference;