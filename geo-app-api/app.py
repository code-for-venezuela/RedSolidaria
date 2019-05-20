from flask import Flask
from flask import request
# importing necessary libraries
import reverse_geocoder as rg
import googlemaps
import pprint
import json
import os
import googlemaps
import geocoder

# for google sheets
import pickle
import pandas as pd
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

app = Flask(__name__)

#function for city to coordinates
def geocoder(city, state):
    place = (city, state)
    g = geocoder.google(place, key = ['GOOGLE_API_KEY'])
    result = g.latlng
    pprint.pprint(result)

def address_to_coordinates(address):
    API_key = os.environ['GOOGLE_API_KEY']
    params = {}
    #This is hardcoded! Change the input address here
    # params["address"] = "Av. Boyacá #80-94, Bogotá, Colombia"
    params["address"] = address
    gmaps = googlemaps.Client(key=API_key)._request("/maps/api/geocode/json", params).get("results", [])
    return gmaps[0]['geometry']['location']

# constants
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
    # print header
    return df


# TODO move this to a module
# TODO write some test cases for this
#function for coordinates to city
def reverseGeocode(coordinates):
    result = rg.search(coordinates)

    # result is a list containing ordered dictionary.
    pprint.pprint(result)

def decending(full_list):
        return sorted(full_list, key=lambda k: k['distance in kilometers'])


#This is for the input of the distance function
# ###Starting point
# #This is hardcoded!!! Change to input
# LatOrigin = 37.772
# LongOrigin = -122.405
# origins = (LatOrigin, LongOrigin)
#
# #enter in destinations through json
# destination_input = input("Enter json: ")
# destination_list = json.loads(destination_input)
#
# for destination in destination_list["coordinates"]:
#
#     distance(origins, (destination["lat"],destination["long"]))


def distance(origins, destination):
    try:
        API_key = os.environ['GOOGLE_API_KEY']

        app.logger.info('distance origins = %s, destination = %s', origins, destination)
        gmaps = googlemaps.Client(key=API_key)

        # call
        result = gmaps.distance_matrix(origins, destination, mode='walking')
        # result is in meters
        app.logger.info("result -> %s", result)
        origin_result = result['origin_addresses']
        destination_result = result['destination_addresses']
        meters = result['rows'][0]['elements'][0]['distance']['value']
        distance_result = meters/1000
        list = {"origin" : origin_result, "destination" : destination_result, "distance in kilometers" : distance_result}
        return list
    except:
        return "invalid"


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

# add a route to get a list organizations
# testing with http://localhost:5000/listorgs?data={ "lat":4.682, "lng":-74.0998}
@app.route("/listorgs", methods=['GET', 'POST'])
def listorgs():
    app.logger.info('starting listorgs')
    origin = json.loads(request.args.get('data'))
    orgs_data = spread_extract("1-81VwUDn0daYXsjdLEQPxyt4LalQy_u6hRvPT1M4CyA", "mirror")

    results = []
    for index, org_data in enumerate(orgs_data, start=1):
        app.logger.info('index is %d , org_data is %d', index, len(org_data))
        address = org_data[11] # we know 11 is Dirección, so we can have a function for this later
        app.logger.info('address is %s', address)
        coordinate = address_to_coordinates(address)
        dist = distance((origin["lat"], origin["lng"]), (coordinate["lat"], coordinate["lng"]))
        org_entry = {}
        org_entry = {"address": address, "origin": origin, "coordinate" : coordinate, "distance" : descending(dist)}
        results.append(org_entry)

    result = json.dumps(results)
    return result

if __name__ == "__main__":
    service_port = os.environ['SERVER_PORT']
    if len(service_port) == 0 :
        service_port = 5000
    app.run(debug=True,host='0.0.0.0',port=service_port)
