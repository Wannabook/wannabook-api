# wannabook-api

This is a repo for the API part of Wannabook.

### Git rules
* merges are only after code review
* one cannot push into develop branch straightly. We create pull requests instead and wait for others' approval before merging
* branch naming convention `feature/WNB-19/some-feature-name`
* commit names convention: `WNB-19: Create some feature`

### Server Setup
* Run `npm i` to install dependencies
* Run `npm run start:dev` to start server with nodemon
* Go to ```http://localhost:5000/```