FROM alpine:3.20

RUN apk add --no-cache socat \
    && adduser -D -H proxy

USER proxy

CMD ["socat", "-h"]
