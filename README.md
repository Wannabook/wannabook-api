# wannabook-api

This is a repo for the API part of Wannabook.

### Git rules
* merges are only after code review
* one cannot push into develop branch straightly. We create pull requests instead and wait for others' approval before merging
* branch naming convention `feature/WNB-19/some-feature-name`
* commit names convention: `WNB-19: Create some feature`

### Server Setup
* Run `npm i` to install dependencies
* Create initial DB and run migrations (see 'Working with database' below).
* Run `npm run start:dev` to start server with nodemon
* Add environment variables required to run the application to one of .env files under the `env` folder.
* Go to ```http://localhost:5000/```

### Working with database
1. To generate initial DB and (or) run outstanding migrations, create `config.js` based on `config-example.js`.

2. Install Run `env-cmd -f ./env/dev.env sequelize db:create` and it will create the DB 'Wannabook' as specified in `config.js`.

3. Inside of migrations folder, you will find all migrations. To run them, do `env-cmd -f ./env/dev.env sequelize db:migrate` and only new migrations will run. They will update your DB accordingly.

4. Fill the DB with test date by running `env-cmd -f ./env/dev.env npx sequelize db:seed:all`
