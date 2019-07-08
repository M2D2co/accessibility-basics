# Accessibility Basics

## Description

If you ever use the elevator, subtitles to watch that cat video during a boring meeting, or tabbed through a form, you have used an accessibility feature. As a community we understand that accessibility is necessary but when it comes to implementation, we often fall short.

This app is the base for a hands on workshop for those interested in learning how to get started.

## Demo

[demo: https://martine-dowden.github.io/accessibility-basics/index.html](https://martine-dowden.github.io/accessibility-basics/index.html)

## Getting Started

### Branches

* `master` has the accessible version of the application.
* `start` has the starting point for the workshop. This branch includes errors that will be tested for, explained, and fixed during the workshop.
* all other branches are steps at different point during the workshop.

## Running the code

1. `$ npm start`: will install live-reload and serve the application on `localhost:8080`.

_Note:_ This step is not strictly required. The application can be run by simply opening `app/index.html` in an modern browser.

_Note:_ A modern browser is necessary because the code relies on:

* JavaScript ES6 syntax
* IndexedDb
