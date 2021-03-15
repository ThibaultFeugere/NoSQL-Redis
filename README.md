# No SQL - TP Redis

## Equipe

- MAURY Louis
- DEMANECHE Antonin
- FEUGERE Thibault

## Installation de Redis

`npm install redis`

## Installation de IoRedis

`npm install ioredis`

## Installation de http-errors

`npm install http-errors`

## Installation de Express JS

`npm install express`

## Installation de bcrypt

`npm install bcrypt`

## Bcrypt 

## Le mot de passe est stocké en bcrypt, pourquoi ?

Le bcrypt est une fonction de hachage qui est basée sur l'algorithme blowfish. 


Bcrypt est une fonction adaptative car on peut augmenter le nombre d'itération pour la rendre plus lente, comme cela elle continue à être resistante aux attaques par bruteforce même avec l'augmentation de la puissance de calcul.

Blowfish est un algorithme de chiffrement par bloc pour sa phase d'établissement de clef relativement couteuse. bcrypt utilise cette propriété.


Pour cet algo il consite dans un premier temps à créer les sous-clefs grâce à la clef et au sel. Ensuite un certain nombre de tours de l'algorithme standard blowfish sont appliqués avec alternativement le sel et la clef. Chaque tour commence avec l'état des sous-clefs du tour précédent. Cette fonction ne rend pas l'algorithme plus puossant que blowfish mais cela permet de choisir le nombre d'itérations ce qui le rend plus lent et s'il est plus lent cela permet de dissuader les attaques rainbow table et brute force

Voici un petit schéma explicatif d'un hash bcrypt 

![https://asecuritysite.com/public/bc.png](https://asecuritysite.com/public/bc.png)


## Au bout de 3 essais infructueux l'OTP est invalidé, un nouveau est envoyé. Pourquoi ?

@steven