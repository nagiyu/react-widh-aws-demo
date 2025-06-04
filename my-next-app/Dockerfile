FROM node:20

WORKDIR /var

COPY setup.sh /var/setup.sh
RUN chmod 700 /var/setup.sh && \
    chown node:node /var/setup.sh

CMD ["sh", "/var/setup.sh"]
