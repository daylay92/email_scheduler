.PHONY: test

up:
	docker-compose up --build
build:
	docker-compose build
test:
	docker-compose run -e NODE_ENV=test backend bash -c "yarn test"