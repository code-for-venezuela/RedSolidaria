from flask import Flask

app = Flask(__name__)

@app.route("/")
    return "you've reached c4v api app"

@app.route("/sayhelo")
def hello():
    return "Flask inside Docker!!"


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')
