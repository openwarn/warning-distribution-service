#!/bin/bash

npm test && npm run lint --fix && docker build -t warning-distribution-service .
