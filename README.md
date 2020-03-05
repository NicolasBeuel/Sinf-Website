# LINFO1212 - Sinf-Website

Ce projet à pour but de créer une platforme permettant de mettre en lien les étudiants de sciences informatiques.

## Contexte

Ceci est la remise du groupe F dans le cadre du cours LINFO1212 - Projet d'approfondissement en sciences informatiques.
Le but était ici de réaliser à l'aide des technologies HTML/CSS/NodeJS/MongoDB un site permettant de référencer les différentes étudiants de sciences informatique.

---

## Prérequis

Afin de pouvoir utiliser ce code, il vous sera necéssaire d'installer (si ce n'est déjà fait) [NodeJS](https://nodejs.org/en/) et [MongoDB](https://docs.mongodb.com/manual/installation/). Ce projet utilise également de nombreux package npm, veillez donc à ce qu'ils soient bien installés (ce qui est normalement le cas automatiquement lors de l'installation de NodeJS). 

---

## Comment mettre en place le serveur et la base de données

1. Premièrement, il est nécessaire d'installer toutes les dépendances du projet. Pour cela ouvrez un terminal, rendez vous dans le dossier racine du projet et tapez : 
```bash
npm install express
npm install mongodb
npm install express-session
npm install ejs
npm install bcrypt
npm install nodemailer
npm install multer
npm install json-query
npm install body-parser
```
2. Ensuite rendez vous dans le dossier **mongodb/** et tapez la commande suivante :
```bash
mongod --dbpath .
```
| Attention: Ne fermez pas ce terminal|
| --- |

3. Ouvrez un nouveau terminal et retournez dans le dossier /mongo. Une fois dedans, tapez les deux commandes suivantes : 
```bash
mongoimport -d sinfStudents -c presets presets.json
mongoimport -d sinfStudents -c users users.json
```

6. Retrounez à la racine du projet et tapez (il est possible que cette commande requiert l'utilisation d'un super-utilisateur:
```bash
node main.js
```

5. Ouvrez votre navigateur et tapez [**localhost**](https://localhost/). 
Note: Etant donné que les fichiers servant à la sécurisation de la connexion en https ne proviennent pas d'un tiers de confiance, il est possible que votre navigateur vous demande de confirmer votre désir d'accéder au site la première fois.

---

## Note

1. Les fichiers *cert.pem* et *key.pem* ayant été rendus publiques, il est indispensable de les changer dans le cas d'une utilisation de ce projet autre que privée et locale.

2. Ce projet utilise deux ports de communication, le 80 (http) et le 443 (https). Il est à noter qu'ici l'utilisation du port 80 ne sert qu'à la redirection vers le port 443.

## coucou
