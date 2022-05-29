back:
	cd back/collecte_memoires && python manage.py runserver

front:
	# nvm install 14.19
	cd front-react && npm start

.PHONY: back front