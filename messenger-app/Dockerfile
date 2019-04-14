FROM node:10

# use debug to troubleshoot
ENV LOG_LEVEL=error

WORKDIR /app

USER root

STOPSIGNAL SIGINT

ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin


# Capture SIGTERM from an orchestrator so we can reliably use entrypoint.sh
# Using tini https://github.com/krallin/tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /bin/tini
RUN chmod +x /bin/tini


ADD entrypoint.sh /bin/entrypoint.sh
COPY package.json /app/
RUN npm install


# USER nobody
COPY . /app
RUN chown -R node:node /app

# compile check for app.py
USER node
ENTRYPOINT ["/bin/tini", "-v", "--", "/bin/entrypoint.sh"]
CMD        [ "" ]
