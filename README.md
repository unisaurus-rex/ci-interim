# Interim Email 
Prototype of interim data insights email

## Install
First, run ```npm install```
    
Then, run ```jspm install```
    
## Installing Dependencies
Any dev dependencies should be installed with npm.  Any client side dependencies should be installed with jspm.
## Serving the Development Version
Download your favorite server package of choice ([http-server](https://www.npmjs.com/package/http-server) is nice). 
## Creating the Production Version

1) From the project root run ```npm run build``` 

2) Copy ```src/index.html``` to  ```build```

3) Find the comments at the end of ```build/index.html```. Remove the scripts needed for the development version only and uncomment the script needed for the build version. 

### A Note on JavaScript Modules
Any module you write needs to be imported in ```scripts/startup.js```, or used by a module imported in ```startup.js```
## Custom NPM Scripts
The following scripts can be run using ```npm run <command-name>```

```npm run build```

Create a production version of the site in ```build``` folder 


```npm run sass```

Compile sass files in styles/sass and output to styles/css

```npm run watch-sass```

Watch styles/sass for changes. On any change, compile to styles/css

## Testing

### Unit Testing
[Jasmine](https://jasmine.github.io/) and [Karma](https://karma-runner.github.io/1.0/index.html) are used for unit testing.  Jasmine is a testing framework and Karma is a test runner. What's the difference, you ask?  You write your tests using Jasmine and it's libraries.  Once you write your tests, you need to run the code in a browser javascript engine.  Karma handles a lot of the annoying things that come with trying to run your code in different browser engines.  

#### Set up
Most of what you need to run tests will be installed when you run ```npm install```, but there are some additional steps you also need to take.

1) Install Jasmine globally (it's already installed locally) ```npm install -g jasmine```

2) Install the node karma command line tool globally ``` npm install -g karma-cli```

#### Running All Tests
```npm test ```

#### Running Select Tests
coming soon...

#### Adding Tests
All test files live in ```src/spec``` and should have a name that ends in ```-spec.js```  Any file that you want to test will need to be imported, just like you would with any other file in jspm.  For an example, see ```src/spec/hello-spec.js```

#### Errors When Running
When you try to run your new spec, you may encounter errors loading files imported by your new spec.  To fix these, try the following steps:

1) Check the error message in the console and make note of the load path Karma and SystemJS attempted to use. 

2) In ```src/config.js```, if there is not yet an entry in the map object for the file that is causing the error, add an entry and adjust any files that depend on the module accordingly.  

3) This should fix the issue in most cases.  If that doesn't work, you may need to look at ```karma.conf.js```  Specifically the proxies object and the jspm:paths object.

#### Technical Details You Won't Need Until You Do
1) The Karma server serves all files from /base/<your path starts here>

2) karma-jspm is a karma plugin that allows us to use our jspm/es6 modules with Karma and Jasmine. In some instances Karma's server paths may cause conflicts with the paths set up in the jspm config.js file.  To work around this, there is a jspm object in karma.conf.js that can be used to tell Karma how to reconfigure paths for testing only.

## Modules
### Model
The Model module reads a json string that represents the insights data and exposes a function for retrieving subsections of the data.  See the [csv-parser repo](https://github.com/unisaurus-rex/csv-parser) for more details about the structure of the data.
### Checkboxes
The default export from the Checkboxes module is the Checkboxes class.  Use this class for tracking the state of a checkbox or checkboxes. A checkbox can have a value of either ```true``` or ```false```.  The class considers a checkbox to be checked if it has a value of ```true```. The class exposes methods for getting the values of a single checkbox or all checkboxes, toggling a checkbox, and retrieving an a list of all boxes that are currently checkbox.
In practice you should not need to use the Checkboxes module directly as it is used internally by the checkboxObserver module.
### checkboxObserver
This module is necessary because of [Bootstrap's checkbox implementation](http://getbootstrap.com/css/#checkboxes-and-radios). Bootstrap requires that you wrap an input element in a label. Checking or unchecking a Bootstrap checkbox is only guaranteed to add or remove the 'active' class from the label. 

By default, the module exports a single function, ```addBootstrapCheckboxObservers```. Calling ```addBoostrapCheckboxObserver``` returns a configurable function in the style of Mike Bostock. Calling the returned function will create listeners that check for the addition or removal of the 'active' class from the label. If the listener detects this change, it will pass an array of strings representing the currently checked values to a callback function. In addition, calling the returned function will return a Checkboxes object that can be used to get the current checked values. 

Example usage:

```
// config observer function
var observersFunc = addBootstrapCheckboxObservers().elementIds(<myIds>)
    .values(<myVals>)
    .defaults(<myDefaults>)
    .callback(<myCallback>);

// add observers
// observersFunc returns a Checkbox object that can be used to get checked values
var boxes = observersFunc();
```
