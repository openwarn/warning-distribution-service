# WarningDistributionService

WarningDistributionService is a component of OpenWarn. It provides an API to add and distribute warnings via a message broker.

Alerts posted to this service must be formatted as [CAPv1.2](http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html).

## About OpenWarn

OpenWarn is a prototypic open-source warning system which leverages modern microservice architecture concepts
to build an modular and customizable integrated warning system.

It was created as part of the master thesis called
`Konzeption einer Softwarearchitektur für ein Nachrichtensystem zur Warnung der Bevölkerung in Gefahrensituationen` (conception of a software architecture for public warning message systems) at Technical University Ilmenau in 2019.

## Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=12), npm version 7+.

```bash
npm install
```

### Build Docker Image

```bash
docker build -t warning-distribution-service .
```

## Run

```bash
docker run -p 9101:9101 --env KAFKA_HOST="localhost:9092" warning-distribution-service
```

## Configuration

This service is configurable via environment variables (docker).

* KAFKA_HOST: IP-Address / Host-Name of the message broker instance (kafka)
* MAX_XML_SIZE: Maximum size of an incoming cap xml file (e.g "5mb")

## Contributing

Feel free to contribute to OpenWarn by creating a pull request or adding an issue.

If you are interessted in supporting this project or building a warning system based on this software, contact me via GitHub.

## License

  [MIT](LICENSE)
