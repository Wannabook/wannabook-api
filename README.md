# wannabook-api

This is a repo for the API part of Wannabook.

### Git rules
* merges are only after code review
* one cannot push into develop branch straightly. We create pull requests instead and wait for others' approval before merging
* branch naming convention `feature/WNB-19/some-feature-name`
* commit names convention: `WNB-19: Create some feature`

### Server Setup
* Run `npm i` to install dependencies
* Create a `config.json` file inside `/config`. This is responsible for syncing your models with database
* Run `npm run start:dev` to start server with nodemon
* Add environment variables required to run the application to .env file in project root. Don't forget to puut quotes around values.
```
process.env.VAR1="Some value"
process.env.VAR2="Another Value"
```
* Go to ```http://localhost:5000/```

### Working with database
To generate initial DB and (or) run outstanding migrations, create `config.json` based on `config-example.json`. Put quotes around every entry except `null`s.

Run `sequelize db:create` and it will create the DB 'Wannabook' as specified in `config.json`.

Inside of migrations folder, you will find all migrations. To run them, do `sequelize db:migrate` and only new migrations will run. They will update your DB accordingly.
