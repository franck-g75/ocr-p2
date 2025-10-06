# Les jeux olympiques en angular !

Ceci est un projet de test, pour aprendre à coder en angular.

## Limites du projet 
 - HttpClientModule is deprecated
 - Les tableaux très mal formés ne sont pas gérés
    - si il comporte deux fois le meme nom de pays : le logiciel ne fera pas la somme et considèrera deux pays différents
    - si des noms de pays sont manquant : le logiciel affiche undefined.
    - un pays avec participation vide sera comptabilisé dans le nombre de pays mais ne sera pas visible dans le graphique
 - si on coupe le serveur alors les deux pages continuent de fonctionner jusqu'à une actualisation qui entrainera l'affichage d'une erreur de navigation (connexion echouée)
 - la couleur bleue du graphique de détail est paramétrable dans deux endroits différents. 
 
## Points positifs du projet
 - Il ne recharge pas le tableau à chaque changement de page.
    - Le tableau n'est chargé qu'une seule fois dans le composant app pour toutes les pages.
    - Le tableau est rechargé à la réactualisation de la page (cela fonctionne meme sur detail)
 - Il peut gérer :
    - les tableaux commençants par 1 ou 0 (en fonctionnant normalement)
    - un fichier completement vide (erreur gérée par affichage d'une page spéciale)
    - un fichier avec un tableau vide (erreur gérée par affichage d'une page spéciale)
    - un fichier absent (erreur gérée par affichage d'une page spéciale)
    - un mauvais numero de pays dans l'url detail (erreur gérée par affichage d'une page spéciale)
    - une chaine alphabétique à la place du numero de pays dans l'url detail (erreur gérée par affichage d'une page spéciale)
 - Il utilise plusieurs classes pour une gestion d'erreur centralisée
 - Il utilise un service centralisé pour gérer les logs (non demandé mais très utile)
 - un fichier SCSS centralisé avec 3 variables de couleur
 - Il utilise les composants https://swimlane.gitbook.io/ngx-charts
 - Les 2 pages sont completement responsives.

## En bref
 - N'étant pas sur la formation à plein temps
 - N'ayant pas codé depuis 20 ans
 - N'ayant pas regardé les lessons gratuites avant de commencer le projet
 - Ce fut long et difficile... 2 mois pour 40 heures prévues.
 - Mais j'ai appris beaucoup de choses !

## Architecture - Comment cela fonctionne-t-il ?
 - Il existe 4 classes dans le répertoire models 
   - Olympic et Participation pour le model métier
   - Statistic et DetailedStatistic pour les données formatées des graphiques
   - Les données sous le titre sont stockées dans des tableaux
 - Il existe 4 pages (home, detail, not-found et error)
   - home ne fait qu'afficher les données de la page d'accueil 
   - detail ne fait que lire le paramètre et afficher son graphique et ses données 
     - il gère aussi les erreurs de paramètrage (URL)
   - not-found affiche le message [No corresponding page found]
     - un composant NotFoundComponent gère tout seul cette erreur
   - error affiche la chaine passée en paramètre
     - un composant ErrorComponent redirige les erreurs (sauf not found) vers ma classe MyErrorHandler
     - MyErrorHandler redirige l'erreur ver la page d'erreur ou la console (suivant le type d'erreur)
 - Il existe un seul service métier : olympicService
   - C'est le OlympicService qui calcule les données métiers à afficher.
 - Il existe un seul service pour loguer : my.loging.service (non demandé mais très utile)
   - Les Logs comportent 5 niveaux de log : Debug, Info, Warn, Error, Fatal
 - Il existe un systeme de gestion d'erreurs sophistiquées (mais non infaillible)
 - J'ai été obligé de changer le package.json pour accepter les graphiques.
   - Il faut donc refaire npm install avant de compiler.
 - La bonne URL est http://localhost:4200/ (fonctionne sous angular 18.2.13)



