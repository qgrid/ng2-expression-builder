# Expression Builder
Simple extensible framework for compact markup building with fluent interface.
This is a rewritten version of [angularjs expression builder](https://github.com/vkorolev/expression-builder).

`Expression builder` tries to encapsulate the most of logic that can be happen while building complex tree based UI. 
It tries to collect imperative instructrion under the declarative containers. Tries to be pretty, but extensible, powerfull, but not sophisticated.We believe that expression builder can dramatically help to connect UI and hierarchical structures. 
* On the first step you say what elements you want to use in yours UI(buttons, lists etc.)
* On the second step you tell about instuctions that should be applied in your UI(add button and list, add element, remove element etc.). 
* On the third step you just bind your instructions to UI, thats it!

## Installing
`npm i --save ng2-expression-builder`

## Example
[Stackblitz](https://stackblitz.com/edit/expression-builder-ng2-05-00-01?file=app%2Fapp.component.ts)

## How it can look like
![alt tag](https://github.com/vkorolev/expression-builder/blob/master/assets/example.png?raw=true)

## Licence
Code licensed under MIT license.

## Development server

Run `npm start` for a dev server, run `npm run start:lib` to build the lib in watch mode. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
