<h1 align="center">Chat Room App</h1>

[Live demo of this app](https://avu120-global-chatroom.herokuapp.com/)

Note: This readme is very out of date. I will update it soon.

## Table of Contents

- [About](#about)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Accessing the Application](#accessing-the-application)
- [Using the Application](#using-the-application)

## About

A chatroom app that lets you chat with others in real-time while seeing all previously sent messages. Create an account with an email & password or log in with your Google or GitHub account to enter the chatroom.

## Built With

- [React](https://reactjs.org/) for frontend
- [Node](https://nodejs.org/en/) for backend
- [Express](https://expressjs.com/) for backend APIs
- [Google Firebase Authentication](https://firebase.google.com/docs/auth) for user login.
- [Google Firebase Realtime Database](https://firebase.google.com/docs/database) for storing user-generated data in the cloud, sharing it with clients, & keeping data in sync between clients, all in real-time.

## Getting Started

1. Clone the project source code.

```
git clone https://github.com/AVu120/chat-room.git
```

2. Navigate into the client folder.

```
cd client
```

3. Download all required client dependancies.

```
npm i

```

4.

- Create a client\client\src\services\firebase.js file with the following content:

```
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "##################################",
  authDomain: "##################################",
  databaseURL: "##################################",
  projectId: "##################################",
  storageBucket: "##################################",
  messagingSenderId: "##################################",
  appId: "##################################",
  measurementId: "##################################",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.database();
```

- Create a Google Firebase account if you don't already have one.
- Go to your [Firebase Console](https://console.firebase.google.com/).
- Follow the prompts to create a project.
- On your project dashboard, click 'Add App' > Web.
- Follow the prompts then during the 'Add Firebase SDK' stage, copy the configuration details into the corresponding properties in the firebaseConfig object in the client\src\services\firebase.js file you just created.
- Save the changes made to client\src\services\firebase.js.

5.

- On your Firebase project dashboard, click on Authentication (on left side panel under 'Develop' heading) > Sign-in method:
- Toggle the status of Email/Password, Google and GitHub to 'Enabled'.
- After you toggle GitHub to 'Enabled', you'll need to enter a 'Client ID' and 'Client secret' before you can save it.
- [Register this chatroom app on your GitHub account](https://github.com/settings/applications/new). Afterwards you'll receive a client ID and client secret that you can enter into the previous form fields in Google Firebase Project Dashboard > Authentication > Sign-in > GitHub.
- Click Save.

6. Start the app.

```
npm start
```

## Accessing the Application

1. Enter localhost:3000 into any web-browser.

## Using the Application

1. Sign-up by creating an account with email & password (or login with email & password if you've already done this). Alternatively you can log into the app using your Google or GitHub account.
2. Read previously sent messages and chat in real-time to anyone else that is currently logged into the app.
