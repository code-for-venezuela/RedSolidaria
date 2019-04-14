from flask import Flask
from flask import request
# importing necessary libraries
import reverse_geocoder as rg
import pprint
import json
import os

app = Flask(__name__)

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

# just a simple ping route
@app.route("/ping")
def ping():
    return jsonify({"status":"OK"})

# We need to be able to take inputs, so this is just a sample
# function that demo's how to get JSON from input
@app.route("/json_get", methods=['GET', 'POST'])
def json_get():
    content = request.json
    return jsonify({"status":"OK"})

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
