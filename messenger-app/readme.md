## goal
This is an interactive Facebook Messenger app that will be configured as a webhook for Facebook.
The app will follow question/answer flows to provide answers for immigrants.

## Deployment

We'll be deploying this for a POC on Heroku

## Building it

```
make build
```

### Run a server locally

```
make server
```

### Heroku deployment

This requires a heroku cli and heroku setup for your repo to deploy.

Here are some steps for connecting your heroku app:

```
make publish
```
#### Environment Requirements

| Environment   | Description  |
|---------------|:------------:|
| APP_ID        |  Application ID |
| DOMAIN_URL    |  Domain URL     |
| PAGE_ACCESS_TOKEN | Page Access Token |
| PAGE_ID | Page ID |
| VERIFY_TOKEN | Type of verification |
| PORT | Port for service |
