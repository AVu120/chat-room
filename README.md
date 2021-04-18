<h1 align="center">Chat Room App</h1>

[Live demo of this app](https://avu120-global-chatroom.herokuapp.com/)
![image](https://user-images.githubusercontent.com/38395166/115162639-03b54400-a0e8-11eb-99ad-da4d0998a9e9.png)

## Table of Contents

- [About](#about)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Accessing the Application](#accessing-the-application)
- [Using the Application](#using-the-application)

## About

Chat with others in real-time while seeing all previously sent messages. Create an account with your email & password then join the chatroom!
![image](https://user-images.githubusercontent.com/38395166/115162663-25aec680-a0e8-11eb-8aa2-e27d6081dfd6.png)

## Built With

- [React](https://reactjs.org/) for frontend.
- [Node](https://nodejs.org/en/) & [Express](https://expressjs.com/) for backend.
- [Google Firebase Authentication](https://firebase.google.com/docs/auth) for user login.
- [Google Firebase Realtime Database](https://firebase.google.com/docs/database) for storing messages in the cloud. It also keeps all data/messages in sync on all clients using an "update-data" event listener (provided by Firebase SDK in server\bin\www on line 36) running on the backend.
- [Web Sockets](https://socket.io/) to publish/push every newly sent message received on the server from the "update-data" event listener to all listening clients.

## Getting Started

1. Clone the project source code.

```
git clone https://github.com/AVu120/chat-room.git
```

2. Checkout to either dev or main branch.

```
git checkout dev
```

OR

```
got checkout main
```

3. Install all dependencies in client folder

```
cd client
npm i
```

4. Install all dependencies in the server folder.

```
cd ../server
npm i
```

4.

- Create a .env file in the server folder (server/.env) file with the following content:

```
API_KEY=
AUTH_DOMAIN=
DATABASE_URL=
PROJECT_ID=
STORAGE_BUCKET=
MESSAGING_SENDER_ID=
APP_ID=
MEASUREMENT_ID=

```

5.

- Create a Google Firebase account if you don't already have one.
- Go to your [Firebase Console](https://console.firebase.google.com/).
- Click 'Add Project' then follow the prompts to create a project.
- On your project dashboard, click 'Add an app to get started' > Web.
- Follow the prompts until you reach the 'Add Firebase SDK' part.
- Add the values in the firebaseConfig object to the corresponding properties/key-names in your server/.env file.

6.

- On your Firebase project dashboard, click on Authentication (on left side navbar).
- Click on 'Get started' > 'Sign-in-method' > 'Email/Password' > Toggle 'Allow users to sign up using their email address and password. Our SDKs also provide email address verification, password recovery, and email address change primitives.' > click 'Save'.

7.

- On your Firebase project dashboard, click on 'Realtime Database' (on left side navbar).
- Click 'Create Database' > select db location closest to you > leave 'Start in locked mode' selected and click 'Enable'.
- On the Realtime database page, click 'Rules'.
- Here is text policy of who can do what in your realtime database. Currently it is

```
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

which means that no one can read from or write to your realtime db at all.
Change it to this:

```
{
  "rules": {
    "messages": {
    ".read": "auth != null",
    ".write": "auth != null"
  	}
  }
}
```

which means anyone who is authenticated into your Firebase project (e.g. by logging in with email & password) can read from or write to the "messages" object inside your realtime db. The "messages" object will store/save all the messages sent by users of this chatroom app. Outside the "messages" object, no one will have access to read/write anything.

8. Start the frontend server.

```
cd ../client
npm start
```

7. Start the backend server.

```
cd ../server
npm start
```

## Accessing the Application

1. Enter localhost:3000 into any web-browser.

## Using the Application

1. Sign-up by creating an account with email & password. An email verification request will be sent to the email you used.
2. Verify your email by clicking on the link in the email verification request email.
3. Log in using your email and password.
4. Scroll up to read previously sent messages.
5. Type a message into the bottom text field and press the enter key or click 'send' to send it to others.

## Deployment to Production on [Heroku](https://www.heroku.com/)

The deployment branch contains code changes required for production deployment on the Heroku platform.

Checkout to the deployment branch.

```
git checkout deployment
```

and you'll see the following changes:

- Frontend and backend are on the same server now (1 server in total instead of 2). This is achieved by this line in server\app.js:

```
app.use(express.static(path.join(__dirname, "..", "client", "build")));
```

This tells the express server (which also acts as a web server) to fetch the static frontend files (e.g. index.html, static *js & *css files that are all built/optimized specifically for prod) in client/build folder and return them to the client to display/render the frontend whenever the app is first accessed. The client/build folder is generated by running `npm run build` in the client folder.

- CORs has been disabled (since there's only 1 server now and to protect the app on the public internet).
- nodemon has been removed.
- dotenv has been removed since production uses env variables to store secrets/api-keys instead of .env files.
- 'localhost:5000' has been removed from the baseApiUrl string used as the api server endpoint on the frontend. This is because as both frontend and backend are running on the same server & port number, API requests pointing at "/" on the frontend will by default hit the api server.
- Added package.json in root directory to facilitate build & deploy of app on Heroku. In this package.json:

```
    "build": "cd client && npm i && npm run build",
    "start": "cd server && npm i && npm start"
```

After starting a [manual or automatic deployment of this app onto Heroku from a GitHub repo](https://devcenter.heroku.com/articles/github-integration), the build script will run during the build phase and the start script will run during the deploy phase. Each script is run from the root directory of the project on Heroku. After about 2-3 minutes from the start of deployment, the app will be accessible via the Heroku app url.
