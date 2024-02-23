# NGROK

Ce dossier permet de configurer les deux tunnels NGROK nécessaires au fonctionnement de RemotePi en version développement.

A noter que pour déployer la solution en production, il serait préférable d'opter pour des solutions d'hébergement avec des IP fixes, afin de simplifier l'utilisation de la solution.

Le fichier `ngrok.conf` contient la configuration permettant d'exposer via des IP publiques le serveur Flask et le flux de la caméra, afin qu'ils soient accessibles par le serveur web.
