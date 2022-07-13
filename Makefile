back:
	cd back/collecte_memoires && python manage.py makemigrations;
	cd back/collecte_memoires && python manage.py migrate;

	# https://stackoverflow.com/questions/62555499/django-react-the-resource-was-blocked-due-to-mime-type-text-html-mismatch
	cd back/collecte_memoires && python manage.py runserver --noreload

shell:
	cd back/collecte_memoires && python manage.py makemigrations;
	cd back/collecte_memoires && python manage.py migrate;

	# https://stackoverflow.com/questions/62555499/django-react-the-resource-was-blocked-due-to-mime-type-text-html-mismatch
	cd back/collecte_memoires && python manage.py shell

front:
	# nvm use 14.19
	cd front-react && npm start

build:
	cd front-react && npm run build;
	mkdir -p back/collecte_memoires/react_build/;
	cp -r front-react/build/* back/collecte_memoires/react_build/

.PHONY: back front