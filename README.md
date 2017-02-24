# Interim Email 
Prototype of interim data insights email

## Install
First, run ```npm install```
    
Then, run ```jspm install```
    
## Installing Dependencies
Any dev dependencies should be installed with npm.  Any client side dependencies should be installed with jspm.
## Serving the Development Version
Download your favorite server package of choice ([http-server](https://www.npmjs.com/package/http-server) is nice). Point your server at ```./src```
## Creating the Production Version

1) From the project root run ```npm run build``` 

2) Copy ```src/index.html``` to  ```build```

3) Find the comments at the end of ```build/index.html```. Remove the scripts needed for the development version only and uncomment the script needed for the build version. 

## Creating the Github Demo site
The github site displays the files located on the master branch in ```/demo``` To update the site do the following:

1) On the master branch, run the build process as described above

2) ```npm run copy-demo```

3) Push the changes to master 

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

## Project Organization
### Data
The data that drives the visualizations is first provided to us as a csv. To avoid making a runtime request to read the csv, we parse the csv ahead of time into a javascript file named ```data.js``` See the [csv-parser library](https://github.com/unisaurus-rex/csv-parser) for more details

### Structure
All development files are stored in ```src``` The project has an MVC structure. 
#### Model
Model modules are located in ```src/scripts/model``` The data from ```data.js``` is read into and accessed from ```model.js``` Each chart has its own model module for storing state specific to the chart.
#### View
Each chart has its own repo. Testing and development of the chart should be done in the chart repo. The chart files are then copied from their repo to ```src/scripts/charts``` (Some day maybe we'll use jspm to import the charts instead). Every chart exposes a drawing function that is called by the controller.
#### Controller
The controller modules, located at ```src/scripts/controllers``` exist to mediate between the model and a chart. Every chart has a corresponding controller module. The controllers store state locally related to drawing, all other state is stored in the chart's model file. Controller modules expose a single public function responsible for handling all set up and rendering of a chart.
#### Miscellaneous
Various helper modules are located at ```src/scripts/utils```
#### Startup
```src/scripts/startup.js``` is the only javascript file loaded by ```src/index.html``` For any code to run the controller must be imported and called from ```startup.js```

