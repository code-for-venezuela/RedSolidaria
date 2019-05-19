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

## Requirements

You'll need a Google API Key and Google Spreadsheet ID for the database.

### Generating Google API Key
1. Navigate to [Quickstart docs](https://developers.google.com/docs/api/quickstart/python) and perform step 1, push button "Enable the Google Docs API".  There should be a link here to take you to the API Console where there is a quickstart project setup. The quickstart project can serve as a development environment.

  ![image](https://user-images.githubusercontent.com/1907138/57985810-74e2ad00-7a22-11e9-9a0d-93bd774d5631.png)

1. Click the library option and search for the following API's, you'll need each enabled:
   - Google Sheets APIs
   - Geolocation API
   - Geocoding API
   - Distance Matrix API
   Google won't show that you have all the API's enabled in one place from the console, however, later on when you setup your credentials on the new Quickstart project, then you'll be able to see the enabled API's while you restrict access to them.
1. You can also manage the project and change the name if needed, you'll need to enable billing for the project and account.
   Most of the API's are free to a limit however putting a budget can also be useful.
1. Navigate back to the [API Console](https://console.developers.google.com/apis/dashboard) and choose Credentials
1. Remove any OAuth credential that is configured. Provides interactive user authentication for your project, which won't be used.
1. Choose "Create credentials" and choose "API key". Save the API key presented and this should be setup as the environment variable called **`GOOGLE_API_KEY`**. We'll choose restrict key option next. You can use the command `export GOOGLE_API_KEY=Abcde123`, where Abcde123 is the value of the key.
1. Choose restrict key option and under the API restrictions section you can choose the Restrict key radio button to select the API's that the key will only be used for. You should see the 4 API's listed in the drop down. If not go back to previous steps to enable those API's. Save your changes. You should now be ready to use the app api service.

### Google Spreadsheet ID
1. We need a spreadsheet ID to lookup source service addresses. Find the services address worksheet from RedSolidaria slack team.
1. Choose File-> Share and select a viewable shared link. After the URL path **https://docs.google.com/spreadsheets/d/** save the key. For example the key in `https://docs.google.com/spreadsheets/d/1-ABC_123/view?usp=sharing` is **1-ABC_123**.
1. Configure the Spreadsheet ID as the environment value **`GOOGLE_WORKSHEET_ID`** with the command `export GOOGLE_WORKSHEET_ID=1-ABC_123`.

## Functional Test

You should be able to execute some functional testing on the app.py by starting up the server and running a POST command with the following url:

```
http://localhost:5000/listorgs?data={ "lat":4.682, "lng":-74.0998}
```
