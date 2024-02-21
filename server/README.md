# Server

Le dossier `server` contient tous les fichiers permettant de faire tourner un serveur python utilisant la librairie Flask.

C'est ce serveur qui reçoit et gère les requêtes émises par les étudiants via la plateforme web.

## server.py

Le fichier `server.py` est responsable du déploiement du serveur Flask qui sert de backend à notre projet.
Celui-ci permet :

- La compilation du code envoyé au format `.ino`
- Le transfert du code de l'interface web au robot
- L'état des robots
- Le retour du flux vidéo en direct
- La gestion du git permettant le transfert du code vers le bon robot
- La remontée de logs du robot vers l'interface web

## server.yml

Le fichier `server.yml` contient la documentation SwaggerUI des routes mises à disposition par `server.py` au format YAML.

Il est servi par le serveur Flask sur la route `/doc`.

Le choix d'utiliser [SwaggerUI](https://github.com/swagger-api/swagger-ui) pour documenter notre API est motivé par l'interface dynamique sur laquelle les développeurs peuvent directement tester les fonctionnalités, voir les paramètres de chaque route, et étudier en temps réel le retour de chaque requête.

## template.ino

Le fichier `template.ino` est le template nécessaire pour l'envoi du code au robot. Celui-ci permet donc une vérification de la présence du template côté backend, en plus de la vérification déjà existante sur le client Web.
