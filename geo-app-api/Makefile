build:
	docker build -t geo-app-api .

server:
	echo "starting a local server"
	docker run --rm -e PORT=5000 -p 5000:5000  geo-app-api

shell:
	docker-compose exec api /bin/bash

psql:
	docker-compose exec psql psql -U postgres

publish:
	heroku container:login
	heroku container:push web --app geo-app-api
	heroku container:release web --app geo-app-api
