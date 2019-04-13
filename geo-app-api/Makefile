build:
	docker build -t geo-app-api .

server:
	echo "starting a local server"
	docker run --rm -e PORT=5000 -p 5000:5000  geo-app-api

publish:
	heroku container:login
	heroku container:push web --app geo-app-api
	heroku container:release web
