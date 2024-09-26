# challenges-receipt-processor

## Overview

The receipt processor backend service is built using Typescript, using NestJS which is a very popular framework for building backend services.

## Installation

### Running using Docker

After making sure that docker is running, from the root directory run

```bash
docker build -t receipt-processor:latest .
docker run --name receipt-processor-app -p 3000:3000 receipt-processor:latest
```
