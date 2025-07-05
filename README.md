# OlympicGamesStarter

Ceci est un projet de test, pour aprendre à coder en angular.

## Table des matieres
 - [points négatifs du projet](#Points négatifs du projet)
 - [points positifs du projet](#Points positifs du projet)

##Points négatifs du projet : 
 - HttpClientModule is deprecated
 - http://localhost:4200/detail?country=5 
 + si cette url est tapée directement dans la barre d'adresse alors 1 page d'erreur s'affiche
 + si l'utilisateur clique sur le graphique de la page d'accueil cela passe
 + pourtant c'est la meme url...
 - Les tableaux très mal formés ne sont pas gérés
 + si il comporte deux fois le meme nom de pays : le logiciel ne fera pas la somme et considèrera deux pays différents
 + si des noms de pays sont manquant : le logiciel affiche undefined.
 + un pays avec participation vide sera comptabilisé dans le nombre de pays mais ne sera pas visible dans le graphique
 - si on coupe le serveur alors les deux pages continuent de fonctionner jusqu'à une actualisation qui entrainera l'affichage d'une erreur de navigation (connexion echouée) 
 
##Points positifs du site :
 - Il ne recharge pas le tableau à chaque changement de page.
 + Le tableau n'est chargé qu'une seule fois dans le composant app pour toutes les pages.
 - Il peut gérer :
 + les tableaux commençants par 1 ou 0 (en fonctionnant normalement)
 + un fichier completement vide (erreur gérée par affichage d'une page spéciale)
 + un fichier avec un tableau vide (erreur gérée par affichage d'une page spéciale)
 + un fichier absent (erreur gérée par affichage d'une page spéciale)
 - Il utilise plusieurs classes pour une gestion d'erreur centralisée
 - Il utilise un service centralisé pour gérer les logs
 - un fichier SCSS centralisé avec 3 variables de couleur
 - Il utilise les composant https://swimlane.gitbook.io/ngx-charts
 - Les 2 pages sont completement responsives.






