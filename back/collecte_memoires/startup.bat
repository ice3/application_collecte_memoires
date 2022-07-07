# ce fichier est à placer dans le dossier ouvert en faisant
# WIN-R puis "shell:startup"

# on lance le backend
START /d "C:\Users\33612\Documents\03_Pro\1_clients\08_musee_archeologie\application_collecte_memoires\back\collecte_memoires\dist\serveur_temoignage" serveur_temoignage.exe runserver --noreload

# on lance chrome en mode "kiosk" cela permet d'empécher qu'il soit facilement fermé
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --chrome-frame --kiosk  http://localhost:8000
 