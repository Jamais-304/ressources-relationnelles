## The (RE)SOURCES RELATIONNELLES project

### Project contributions workflow

Each developer must create a branch for the feature he is currently developping.

No one should commit directly to the branch `main`. To push code on `main`, you
must do a merge request (also called "pull request" on Github).

### Backend

You need `.env`

#### With npm

Use the terminal commande `npm install` to install the dependencies and use `nodemon` or `node server.ts` to start the server and API system.

#### Swagger

The API documentation with Swagger is available at : http://localhost:3000/api/docs/

Please use Chrome or Firefox to read the documentation.

##### Credentials

- **Email address** : test@test.com
- **Password** : testtest

#### Tests

Use the terminal commande `npm test`