from flask import Flask
from flask import request
# importing necessary libraries
import reverse_geocoder as rg
import pprint
import json
import os
import pickle
import pandas as pd
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

app = Flask(__name__)

#Scope for the Google Docs API to work
scopes =  ['https://www.googleapis.com/auth/spreadsheets.readonly']

#Credentials for the Google Docs API, it requires a token file
token = open('token.pickle', 'rb')
creds = pickle.load(token)
 

#extract information from a Google spreadsheet


# TODO move this to a module
# TODO write some test cases for this
def reverseGeocode(coordinates):
    return rg.search(coordinates)

@app.route("/")
def index():
    return "you've reached c4v geo api app"

@app.route("/sayhelo")
def hello():
    return "Hola Code for Venezuela!!!"

# TODO move this to a module
# example : http://localhost:5000/revgeocode?lat=12&long=12
@app.route("/revgeocode")
def revgecode():
    # Coorinates tuple.Can contain more than one pair.
    lat = request.args.get('lat')
    long = request.args.get('long')
    coordinates = (lat, long)
    r = reverseGeocode(coordinates)
    # result is a list containing ordered dictionary.
    return json.dumps(r)

if __name__ == "__main__":
    service_port = os.environ['SERVER_PORT']
    if len(service_port) == 0 :
        service_port = 5000
    app.run(debug=True,host='0.0.0.0',port=service_port)
