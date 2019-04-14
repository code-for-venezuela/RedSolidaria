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

app = Flask(__name__)

#function for city to coordinates
def geocoder:
    place = (city, state)
    g = geocoder.google(place, key = ['GOOGLE_API_KEY'])
    result = g.latlng
    pprint.pprint(result)

def address_to_coordinates:
    API_key = os.environ['GOOGLE_API_KEY']
    params = {}
    #This is hardcoded! Change the input address here
    params["address"] = "Av. Boyacá #80-94, Bogotá, Colombia"
    gmaps = googlemaps.Client(key=API_key)._request("/maps/api/geocode/json", params).get("results", [])
    pprint.pprint(gmaps[0]['geometry']['location'])

# TODO move this to a module
# TODO write some test cases for this
#function for coordinates to city
def reverseGeocode(coordinates):
    result = rg.search(coordinates)

    # result is a list containing ordered dictionary.
    pprint.pprint(result)

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

        gmaps = googlemaps.Client(key=API_key)

        # call
        result = gmaps.distance_matrix(origins, destination, mode='walking')

        # result is in meters
        origin_result = result['origin_addresses']
        destination_result = result['destination_addresses']
        meters = result['rows'][0]['elements'][0]['distance']['value']
        distance_result = meters/1000
        list = {"origin" : origin_result, "destination" : destination_result, "distance in kilometers" : distance_result}
        print(list)
    except:
        print("invalid")


@app.route("/")
def index():
    return "you've reached c4v geo api app"

@app.route("/sayhelo")
def hello():
    return "Hola Code for Venezuela!!!"

@app.route("/distance")
def get_distance(origins, destination):

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
