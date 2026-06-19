FROM node:20-alpine

# Drop all capabilities and run as non-root
RUN addgroup -S runner && adduser -S runner -G runner

WORKDIR /code
USER runner

# No ENTRYPOINT — command is passed at runtime via `docker run`
