FROM python:3.7

WORKDIR /app

USER root

STOPSIGNAL SIGINT
# Capture SIGTERM from an orchestrator so we can reliably use entrypoint.sh
# Using tini https://github.com/krallin/tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /bin/tini
RUN chmod +x /bin/tini


ADD entrypoint.sh /bin/entrypoint.sh

COPY requirements.txt /app/
RUN  pip install -r requirements.txt


# USER nobody
COPY . /app

# compile check for app.py
RUN python -m py_compile app.py

ENTRYPOINT ["/bin/tini", "-v", "--", "/bin/entrypoint.sh"]

EXPOSE 5000
CMD        [ "" ]
