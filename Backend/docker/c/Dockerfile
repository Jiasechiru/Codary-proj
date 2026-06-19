FROM alpine:3.19

# gcc + libc-dev for compiling C programs
RUN apk add --no-cache gcc musl-dev

# Drop all capabilities and run as non-root
RUN addgroup -S runner && adduser -S runner -G runner

WORKDIR /code
USER runner

# No ENTRYPOINT — command is passed at runtime via `docker run`
