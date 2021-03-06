# No SQL - TP Redis

## Objectif

L'objectif de ce TP sur deux séances est de mettre en pratique une application qui utilise Redis tout en respectant les bonnes pratiques de sécurité informatique.

De ce fait, il ne faut pas être sensible aux injections NoSQL et avoir une infrastructure solide (1 master, 2 replicas).

## Equipe

- DEMANECHE Antonin
- DIAS Steven
- FEUGERE Thibault
- MAURY Louis

## Arborescence du projet

```
no-sql-tp-redis
├── app
│   ├── app.js
│   ├── config
│   │   ├── config.json
│   │   └── config.json.default
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   └── routes
│       ├── index.js
│       ├── login.js
│       ├── logout.js
│       ├── otp.js
│       ├── register.js
│       └── secret.js
├── databases
├── dependances.md
├── docker-compose.yml
├── docker-compose.yml.dist
├── README.md
├── redis_conf.d
│   ├── Hardredis_master.conf
│   ├── Hardredis_slave.conf
│   ├── preHardredis_master.conf
│   ├── preHardredis_slave.conf
│   ├── redis.conf
│   ├── setup
│   └── slave.conf
└── TP-redis.pdf
```

## Configuration de l'environnement de dev

### Initialisation des valeurs du fichier de configuration

Pour des raisons de sécurité, nous ne pouvons pas versionner les informations sensibles. De ce fait, il est de bonne pratique de créer un squelette de configuration et de le copier sans le versionner sur l'environnement de développement ou de production.

Copier le fichier `docker-compose.yml.dist` : `cp docker-compose.yml.dist docker-compose.yml` et remplacez les valeurs par défaut.

Allez dans le dossier `app/` avec la commande `cd app/`.

`cp config/config.json.default config/config.json`

Vous pouvez renseigner la valeur du port et du mot de passe du serveur redis.

#### Serveur mail

Changer la valeur "ACCOUNT_PASSWORD" de `"pass": "ACCOUNT_PASSWORD"`.

### Installation des dépendances

`npm install`

### Démarrage du serveur

`npm start`

## Infrastructure

### Quelle est votre choix de stratégie pour la mise en cluster ? Pourquoi ?

Pour notre stratégie de mise en cluster nous avons décidé d’utiliser Docker. C’est un service de clustering complet qui permet une grande manipulation de son cluster et une initialisation rapide.

Docker nous permettrait de gérer correctement la persistance des données ainsi que les trois nœuds du cluster. Si un nœud vient à être endommagé nous pouvons agir rapidement afin de rétablir celui-ci.

De plus, c'est une technologie que nous avons utilisée plus d'une fois.

## Sécurité informatique 

### Prendre en compte le TOP 10 OWASP

#### Injection

Les chaines de caractères fournies par les utilisateurs, comme les emails, sont vérifiées par des REGEX.

#### Broken Authentication

Suite à quelques tests, l'authentification nous semble correcte. Un audit, un programme de bug bounty ou encore la publication du code source sur un repository publique peut être une bonne manière de vérifier cela.

#### Sensitive Data Exposure

Le code ne divulgue aucune informations lors de l'utilisation de l'outil. Les messages ont été pensé pour ne révéler aucune information sensible telle que "Email incorrect" ou encore "Mot de passe incorrect". 

En effet, ces informations en disent trop sur le contenu de notre base de données.

#### XML External Entities (XXE)

Nous ne sommes pas concerné.

#### Broken Access Control

Nous n'avons pas de système de grade/groupes. Il y a les utilisateurs connectés et les utilisateurs non connectés.

#### Security Misconfiguration

Du hardening a été mis en place sur la partie Redis. Les fichiers versionnés ne contiennent pas d'informations sensibles. Les bonnes pratiques ont été respectées.

#### Cross-Site Scripting (XSS)

Notre application n'est pas concernée. L'execution de javascript en retour de commande n'a pas lieu.

#### Insecure Deserialization

Nous n'executons pas de code sur le serveur. Il n'y a pas la présence de fonctions tel que eval() qui utilisent comme valeur des éléments modifiables par l'utilisateur.

#### Using Components with Known Vulnerabilities

Nous avons audité notre application avec `npm audit` :

```
/App # npm audit
found 0 vulnerabilities
```

#### Insufficient Logging & Monitoring

Les logs par défauts du système d'exploitation nous semblent suffisants par rapport à l'envergure du projet.

Sources : https://owasp.org/www-project-top-ten/

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

