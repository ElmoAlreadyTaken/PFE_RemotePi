# Server

Ceci est un server en python utilisant la librairie Flask.

## Server.py

Le fichier Server.py est l'implémentation du serveur qui permet :

* La compilation du code envoyé en foramt .ino
* Le transfert du code de l'interface web au robot
* L'état des robots
* Le retour du flux vidéo en direct
* La gestion du git permettant le transfert du code vers le bon robot
* La remonté de log du robot vers l'interface web*


## Server.yml

## template.ino

template.ino est le template necessaire pour l'envoie du code. Ceci permet donc une vérification de la présence du template en backend.