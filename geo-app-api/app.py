from datetime import datetime
from flask import Flask
from flask import request
#importing necessary libraries
import reverse_geocoder as rg
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import pprint
import json
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    service_name = db.Column(db.String(255))
    contact_name = db.Column(db.String(255))
    contact_email = db.Column(db.String(255))
    city = db.Column(db.String(255))
    available_help = db.Column(db.String(255))
    telephone = db.Column(db.String(255))
    attention_capacity = db.Column(db.String(512))
    jobs = db.Column(db.String(1024))
    infrastructure_type = db.Column(db.String(255))
    description = db.Column(db.String(1024))
    address = db.Column(db.String(1024))
    available_via_internet = db.Column(db.Boolean)
    services_avialable_for = db.Column(db.String(512))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    category = db.Column(db.String(512))
    promote = db.Column(db.Boolean)
    rating = db.Column(db.Integer)

# TODO move this to a module
# TODO write some test cases for this
def reverseGeocode(coordinates):
    return rg.search(coordinates)

def insertService(service):
    db.session.add(Service(

    ))

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
