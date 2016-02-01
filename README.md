# Steve Was Here
Steve Was Here is an Angular/Firebase/Google Maps web application that allows sales reps and service techs to 'check-in' at their client locations and easily see which ones are in need of attention. It was built for my brother (Steve) - hence, the name. 

Check out [the demo](https://iwashere.firebaseapp.com). **All sample clients are located in the Lake Michigan area**. Some have apparently even set up shop on the water... :-)

All of the development was, unless otherwise noted, my own work. For application structure and general guidelines/principles, I relied heavily on [John Papa's Angular Style Guide](https://github.com/johnpapa/angular-styleguide).

###Technologies Used
 - Angular
 - Firebase
 - Google Maps
 - Bootstrap
 - Git
 - Gulp
 - Bower
 - Node/NPM

###Map or List
Clients can be viewed on a map or list. The list can be sorted clients by name or date of last check-in, allowing the user to quickly see which clients are in the greatest need of attention.

###Google Map Angular Directive
The map was developed using an Angular directive. Clients are retrieved from Firebase and added to the map using a GeoJSON Data Layer. The map centers on the user's current location and will attempt to find a nearby client (within 5 miles), then (if one is found) default the info window open. 

###Color Factory
A color value - on an HSV scale from green to yellow to red - is calculated and assigned to each client based on the amount of time since the last check-in - 365 days being completely red. This is accomplished through an Angular Factory.

###Pending Updates:
 - Allowing full CRUD operations, so clients can be added, modified or removed
 - Undo check-in
 - Login/registration
 - Establishing security rules so users can only access their own data
