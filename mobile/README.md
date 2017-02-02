# Guidelines Development
If you have a question or criticism or proposed change, TALK ABOUT IT. Nothing in these repos are set in stone. Let's talk about changes as a development group and come up with the best solution if something substantial needs to be changed. More than one brain is always better than one. Always be friendly and honest and treat everyone with respect.

### Tools/Guidelines for Development
1. ESLint - Please follow all styling guidelines laid out by ESLint and our dev dependencies.
    1. For Sublime please refer to https://packagecontrol.io/packages/sublimelint  
    2. For Atom please refer to https://atom.io/packages/linter-eslint
2. GitLab - We host our own instance of Gitlab. All code should be placed in http://git.doubleqliq.com/. Issues are outlined there for work remaining. Please document all progress on issues in the actual git repo.
3. `npm run configure` will automatically associate your IP Address with the repo. Make sure to run this when pulling new changes from the Git.
4. `npm run clean` Please refer to https://github.com/facebook/react-native/issues/4968 if you need background information. Just a helpful method to resolve dependency issues.
5. Babel - we try to make use of ES6 and in some cases ES7. Please listen to your linter package.
    1. Please use arrow functions whenever possible except in the case of stateless components. https://github.com/airbnb/javascript/tree/master/react#class-vs-reactcreateclass-vs-stateless
    2. Please bind your methods in the constructor. DO NOT bind methods in the render function. https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding
        1. Binding methods using the ES7 is preferred. https://github.com/zenparsing/es-function-bind  
6. Use stateless functions whenever possible. https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
7. Do not use `var`. Always use `const` unless the variable needs to be mutated. Please listen to your linter package..
8. Please try to document your pushes in detail (i.e. your git messages) that way documentation exists in the history of the repo. It doesn't have to be long but summarize what the push is about.
9. We make use of index files (please see below component/container/scene structure section). It may somewhat verbose, but we believe it gives the app long-term structure and organization. We also use @providesModule so that imports are easy. https://github.com/facebook/flow/issues/442
10. For exports and imports, please use the ES6 syntax not ES5. We prefer not to export defaults except when using higher order functions. Below are some examples:
    - `export function MyStatelessComponent ({ prop1 }) { return ( ... ); }`
    - `export class MyComponent extends Component { }`
    - ```
        // Exporting a component with a connector (HOC)
        class MyComponent extends Component { }
        export default connectUser(MyComponent)
        // Exporting the component in the index file
        export { default as MyComponent } from './MyComponent'
        ```
11. For the sake of maintainability avoid hard coding values.
12. Prefer to write readable and predictable code instead of short code.
  ```
  // Bad
  const isCorrect = userSequence.filter((v, i) => {
    return v !== systemSequence[i]
  }).length === 0;

  // Good
  const isCorrect = userSequence.filter((userSignal, userSignalIndex) => {
    const systemSignal = systemSequence[userSignalIndex]
    return userSignal !== systemSignal
  }).length === 0;
  ```
12. Try to avoid mutation. Use ES6 spread operators to help.
  ```
  // Bad
  const colors = []
  colors.push('red')
  const updatedColors = colors // you have created a reference, changing one will change the other

  // Good
  const colors = []
  const updatedColors = [ …colors, 'red' ] // no reference
  ```

### Note on Redux
Redux is not the end all be all. Local state is still a good and often appropriate approach to state. Rule of thumb if you are sharing state between components that do not have a parent-child relationship, then that's probably an appropriate time for Redux. As always, communication is always best.

# App Architecture
### Folder Structure
All source code sits in the src directory. Below is breakdown of each folder:
- actions - Redux action creators @providesModule = AppActions
- colors - Colors for the app per the designs @providesModule = AppColors
- components - Our app components which are often stateless and/or reusable across different parts of the app @providesModule = AppComponents
- connect - Our app connectors such as connectUser @providesModule = AppConnectors
- containers - Parents of our components. Ideally this is where you want to handle actions and state changes. In addition, containers are usually connected to feathers via connectFeathers @providesModule = AppContainers
- layouts - Our app layouts @providesModule = AppLayouts
- reducers - Redux reducers @providesModule = AppReducers
- scenes - Scenes are parents of our containers. Scenes have the navigator prop and often an onBack prop (`this.props.navigator.pop()`). The purpose of scenes is primarily to act as a wrapper for our containers and to navigate to other scenes. @providesModule = AppScenes
- services - Our feather services. Remember we try to avoid hard coding values, so this is a good place to put our backend service endpoint names. @providesModule = AppServices
- utilities - Random app utility functions that are useful. @providesModule = AppUtilities
- app.js - our app.
- config.js - configuring your FeathersJS server endpoint.
- routing.js - our router.

### Component/Container/Scene Structure
For the sake of long-term maintainability we use the following folder structure for all of our React Components. The below example is of a fake scene called MyScene.
```
scenes
    |-- MyScene
        |-- index.js
        |-- MyScene.js
        |-- styles.js
    |-- index.js
```
```
// contents of MyScene.js
import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
export const MyScene = () => (
    <View style={styles.container} />
);
```
```
// contents of styles.js
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
});
```
```
// contents of MyScene/index.js
export { MyScene } from './MyScene';
```
```
// contents of scenes/index.js
/**
 * @providesModule AppScenes
 */
export { MyScene } from './MyScene';
```
Again this may seem verbose, but it keeps the app nicely organized and easy to manage.

### Router
We are currently using the Navigator. A branch does exists for NavigatorExperimental which we may or may not switch to in the future. https://facebook.github.io/react-native/docs/navigator.html
