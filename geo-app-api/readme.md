## goal
Goal for this app is to be able to run the a simple api that we can use for geo location and lookup information.

We'll be using this app to connect with the messenger bot.


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

### distance

If you are calculating distance you should set a google API key with the environment variable GOOGLE_API_KEY.
