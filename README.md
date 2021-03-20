# No SQL - TP Redis

## Equipe

- MAURY Louis
- DEMANECHE Antonin
- FEUGERE Thibault

## Arborescence du projet

// TODO : @louis ajouter un `tree` effectué à la racine du projet.

## Configuration de l'environnement de dev

### Initialisation des valeurs du fichier de configuration

Pour des raisons de sécurité, nous ne pouvons pas versionner les informations sensibles. De ce fait, il est de bonne pratique de créer un squelette de configuration et de le copier sans le versionner sur l'environnement de développement ou de production.

Copier le fichier `docker-compose.yml.dist` : `cp docker-compose.yml.dist docker-compose.yml` et remplacez les valeurs par défaut.

Allez dans le dossier `app/` avec la commande `cd app/`.

`cp config/config.json.default config/config.json`

#### Serveur mail

Changer la valeur "ACCOUNT_PASSWORD" de `"pass": "ACCOUNT_PASSWORD"`.

### Installation des dépendances

`npm install`

### Démarrage du serveur

`npm start`

## Infrastructure

### question infra

## Sécurité informatique 

### Le mot de passe est stocké en bcrypt, pourquoi ?

Le bcrypt est une fonction de hachage qui est basée sur l'algorithme blowfish. 


Bcrypt est une fonction adaptative car on peut augmenter le nombre d'itération pour la rendre plus lente, comme cela elle continue à être resistante aux attaques par bruteforce même avec l'augmentation de la puissance de calcul.

Blowfish est un algorithme de chiffrement par bloc pour sa phase d'établissement de clef relativement couteuse. bcrypt utilise cette propriété.


Pour cet algo il consite dans un premier temps à créer les sous-clefs grâce à la clef et au sel. Ensuite un certain nombre de tours de l'algorithme standard blowfish sont appliqués avec alternativement le sel et la clef. Chaque tour commence avec l'état des sous-clefs du tour précédent. Cette fonction ne rend pas l'algorithme plus puossant que blowfish mais cela permet de choisir le nombre d'itérations ce qui le rend plus lent et s'il est plus lent cela permet de dissuader les attaques rainbow table et brute force

Voici un petit schéma explicatif d'un hash bcrypt 

![https://asecuritysite.com/public/bc.png](https://asecuritysite.com/public/bc.png)

un grand homme à dit un jour : 

@hessman "pourquoi bcrypt ? fais un `hashcat --benchmark` et tu verras"

![](https://media.discordapp.net/attachments/494091005872832523/821039297397522442/unknown.png?width=461&height=575)

Sur ce screen on voit qu'une RTX 3070 bruteforce plus rapidement SHA256 que du bcrypt donc @hessman nous a montré que bcrypt est plus lent à bruteforcer. 


### Au bout de 3 essais infructueux l'OTP est invalidé, un nouveau est envoyé. Pourquoi ?

le mot de passe à usage unique (One Time Password) est un mot de passe qui est valable poour une session/transaction.


Un OTP est générés sur une Base de temps, d'un algo mathématique et au bout d'un certains nombre d'essais infructueux il est regénéré pour éviter les attaques de bruteforce.

Voici un petit schéma pour comprendre l'usage du OTP.


![](https://image.codeforgeek.com/wp-content/uploads/2016/12/laravelmobilenumber.png)

## Gestion de Docker

### Nettoyer tous les containers

Pour supprimer tous les containers, même ceux allumés : `docker container stop $(docker container ls -aq) && docker system prune -af --volumes`.