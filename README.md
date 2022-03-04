# DevelOps: Education Like platform

DevelOps website has been developped as part of the 3WA CDA program susing nodejs as a backend server development language and mongodb in order to have data persistence

## PROJECT RESSOURCES

[mockups](/docs/mockups/)
[UML DATABASE](/docs/develOps_database.svg)

## QUICK START

In order to start this project you will need to have mongodb installed on your local machine

### Setup environnment variables


```bash
#At project root directory create a .env file containing the following variables:
DB_USERNAME=root
DB_PASSWORD="4380bcb9-4052-4ed2-8413-bc5b43c70c4d"
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=develOps
SERVER_HOST=localhost
SERVER_PORT=8000
SESSION_SECRET="14b9c2d2-14e2-4e2c-b03f-2ba83f0df858"
SESSION_EXPIRATION_DELAY_MS=172800000
```

```js
//Open the mongo cli and create a user
use develOps;
db.createUser({
    user: <ENVUSERNAME>,
    pwd: <ENVPASSWORD>,
    roles: [
        'readWrite',
        'dbOwner'
    ]
})
```

```bash
#start the development server
npm run dev
```

## DATABAsE MODELING

## Project Resources

- [mongoose](https://mongoosejs.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [nodejs](https://nodejs.org/en/)
- [express](https://expressjs.com/fr/)