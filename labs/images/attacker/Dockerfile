FROM alpine:3.20

RUN apk add --no-cache bash curl nmap netcat-openbsd python3 py3-pip jq grep sed bind-tools vim less \
    && adduser -D -s /bin/bash student

WORKDIR /home/student
USER student

CMD ["sleep", "infinity"]
