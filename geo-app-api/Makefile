build:
	docker build -t geo-app-api .

server:
	echo "starting a local server"
	docker run --rm -p 5000:5000  geo-app-api

publish:
	heroku container:login
	heroku container:push web
	heroku container:release web
