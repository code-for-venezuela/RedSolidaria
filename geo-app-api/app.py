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
def spread_extract(spread_id, sheet_name):
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=spread_id , range= sheet_name).execute()
    values = result.get('values', [])
    return values

#convert list extracted from the Google Spreadsheet to a Pandas dataframe
## Limitations of the function: All blank cells must be filled with a value. Remember that the encoding is UTF-8, so column names in the Pd dataframe require an 'u' prefix: u'Dirección'.
 
def list_to_df(values):
    header = values[0]   # Assumes first line is header!
    data = values[1:]  # Everything else is data.
    all_data = []
    for col_id, col_name in enumerate(header):
        column_data = []
        for row in values:
            column_data.append(row[col_id])
        ds = pd.Series(data=column_data, name=col_name)
        all_data.append(ds)
    df = pd.concat(all_data, axis=1)
    print header
    return df

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
