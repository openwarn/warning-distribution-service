class AlertReference {
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
     * @param {DateTime} sentAt 
     */
    sent(sentAt) {
        this.reference.sentAt = sentAt;
        return this;
    }

    build() {
        return this.reference;
    }
}

module.exports = AlertReference;