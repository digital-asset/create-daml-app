**DISCLAIMER: This work in progress!**

[![DAML logo](daml-logo.png)](https://www.daml.com)

[![Download](https://img.shields.io/github/release/digital-asset/daml.svg?label=Download)](https://docs.daml.com/getting-started/installation.html)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/digital-asset/daml/blob/master/LICENSE)

# Welcome to _Create DAML App_

This repository contains a template to get started with developing full-stack
[DAML](https://daml.com/) applications. The demo application covers the following aspects:

1. A [DAML](https://docs.daml.com/index.html) model (of a simplistic social network)
2. Automation using [DAML triggers](https://docs.daml.com/triggers/index.html)
3. A UI written in [TypeScript](https://www.typescriptlang.org/)

The application showcases a variety of experimental DAML SDK features such as
[DAML triggers](https://docs.daml.com/triggers/index.html) and the
[HTTP JSON API service](https://docs.daml.com/json-api/index.html).

The UI is developed using [React](https://reactjs.org/),
[Semantic UI](https://react.semantic-ui.com/) and its
official [React integration](https://react.semantic-ui.com/).
The whole project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).
Regardless of these choices, all DAML specific aspects of the UI client are
written in plain TypeScript and the UI framework should hence be easily
replacable.


## Getting started

Before you can run the application, you need to install the
[DAML SDK](https://docs.daml.com/getting-started/installation.html) and a
package manager for JavaScript. For the development of this project we have
used [yarn](https://yarnpkg.com/en/docs/install), but others might work
equally well.

You can make a copy of this project either by clicking the
"Use this template" button above or by cloning this repository directly via
```
git clone https://github.com/digital-asset/create-daml-app.git
```

Once you have copy of the project, there are two steps to build it.
First, we need to generate TypeScript code bindings for the compiled DAML model.
At the root of the repository, run
```
daml build
daml codegen ts .daml/dist/create-daml-app-0.1.0.dar -o daml-ts/src
```
The latter command writes TypeScript files into the `daml-ts` workspace on which
`create-daml-app` depends.

Next, install all dependencies and build the app by running
```
yarn install
yarn workspaces run build
```

To start the application, there are again two steps.
First start a DAML ledger using
```
./daml-start.sh
```
This must continue running to serve ledger requests.

Then in another terminal window, start the UI server via
```
cd ui/
yarn start
```
This should open a browser window with a login screen.
If it doesn't, you can manually point your browser to http://localhost:3000.


## A quick tour

You can log into the app by providing a user name, say `Alice`, clicking
on the calculator icon to generate an access token for the DAML ledger,
and finally clicking on "Sign up". You will be greeted by a screen
indicating that you don't have any friends yet. You can change this by
adding a friend in the upper box, say `Bob`. Both boxes on the screen
then reflect the fact that you consider `Bob` a friend. After that, let's
log out in the top right corner and sign up as `Bob`.

As `Bob`, we can see that we don't have any friends yet and that `Alice`
considers us a friend nevertheless. We can make `Alice` a friend by
clicking the plus symbol to the right of here name.


## Using the automation

If you are a very popular and friendly person who is considered a friend
by many other people and wants to reciprocate that friendship in the
application, adding all these other people as friends can become quite
tedious. That is where the automation with DAML triggers mentions above
becomes handy. To fire up the trigger, we need to execute
```
./daml-trigger.sh Alice
```
at the root of the repository.

To see the automation in action, we need to sign up as a new person, say
`Charlie` and add `Alice` as our friend. If we log out and then log in as
`Alice` again, we will see that we reciprocate `Charlie`'s friendship and
consider him our friend too. We didn't have to do anything to get there,
our DAML trigger has done that for us.


## Next steps

There are many directions in which this application can be extended.
Regardless of which direction you pick, the following files will be the most
interesting ones to familiarize yourself with:

- [`daml/User.daml`](daml/User.daml): the DAML model of the social network
- [`daml-ts/src/create-daml-app-0.1.0/User.ts`](src/daml/User.ts) (once you've generated it):
  a reflection of the types contained in the DAML model in TypeScript
- [`src/components/MainView.tsx`](src/components/MainView.tsx):
  the React component using the Ledger API and rendering the main features
- [`daml/Reciprocate.daml`](daml/Reciprocate.daml): the automation using
  DAML triggers


## Useful resources

TBD


## How to get help

TBD
