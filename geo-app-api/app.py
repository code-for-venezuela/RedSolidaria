from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "you've reached c4v geo api app"

@app.route("/sayhelo")
def hello():
    return "Hola Code for Venezuela!!!"


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')
