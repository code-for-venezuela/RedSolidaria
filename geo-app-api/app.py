from flask import Flask
from flask import request
# importing necessary libraries
import reverse_geocoder as rg
import googlemaps
import pprint
import json
import os

app = Flask(__name__)

# TODO move this to a module
# TODO write some test cases for this
def reverseGeocode(coordinates):
    return rg.search(coordinates)

def distance(origins, destination):
    API_key = os.environ['GOOGLE_API_KEY']

    gmaps = googlemaps.Client(key=API_key)

    # call
    result = gmaps.distance_matrix(origins, destination, mode='walking')

    # result is in meters
    pprint.pprint(result['rows'][0]['elements'][0]['distance']['value'])


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
