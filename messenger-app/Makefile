build:
	docker build -t messenger-app .

server:
	echo "starting a local server"
	docker run --rm -e PORT=5000 -p 5000:5000  messenger-app

publish:
	heroku container:login
	heroku container:push web --app c4v-messenger-app
	heroku container:release web --app c4v-messenger-app
