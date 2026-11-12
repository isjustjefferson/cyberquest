FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        pgbouncer \
        bash \
        ca-certificates \
        curl \
        htop \
        jq \
        less \
        nano \
        netcat-openbsd \
        procps \
        python3 \
        vim-tiny \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -s /bin/bash student

COPY cyberquest.sh /etc/profile.d/cyberquest.sh
RUN chmod 0644 /etc/profile.d/cyberquest.sh

USER student
WORKDIR /home/student
ENV PS1='student@workstation:\w$ '

CMD ["sleep", "infinity"]
