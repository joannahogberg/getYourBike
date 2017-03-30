# AJAX Assignment - Open APIs


## getYouBike

Application to display pick-up stations for bikes in selected city https://joannahogberg.github.io/getYourBike/

The idea for this app was to give the user a easy look over where to find public bike-sharing stations in the offered cities in Europe and North and South America. For stations with less then 3 bikes available I have choosen not to display the stations since the possibility that these bikes are no longer available is likely.

## Task
- Downloading data from one or more open APIs serving data as JSON.
- Showcasing retrieved data in a structured way in html.
- Good code structure where you use namespaces and clearly separates the parts of your code logically.
- Implementing the project independently and show that you master what you have written.
- Have good understanding of AJAX and asynchronous communication and how to work asynchronously in JavaScript.

#### APIs
The API's used for this application:

* RESTful Countries API: https://restcountries.eu/rest/v2/region/europe returnes an array of json data objects with information for all countries in Europe. Used to get all country codes.
* CityBikes API: https://api.citybik.es/v2/ returns an array of json data objects with all companies that are connected to CityBikes.
* Google Maps API: https://maps.googleapis.com/maps/api/ which responds with a json callback function from googlemaps.

#### Ajax calls 
The app uses jQuery get() Method with the Promise interface to load data from the APIs.

1. When the buttons are clicked, the first request is sent to the https://restcountries.eu/rest/v2/region/ + (value that is received from the button element). The done Promise then loops through the objects properties and pushes the country code value into the countries array. A loader is applied to notice the user that the page is loading untill the second call is done.

2. The the second call is made to the api https://api.citybik.es/v2/networks. The done Promise here loops through the properties of the response and then loops through the each objects values. Then a jQuery utility function is used to check whether the objects exists in the countries array or not. If true the cities are appended to the select element as options. The loader is removed when the done Promise is successful.

3. The third call is made to the  https://api.citybik.es/v2/networks/ filtered on selected city's id to get the positioning of each station and then apply markers on a google map for each of the stations in selected city.

4. The call made to https://maps.googleapis.com/maps/api/js as mentioned returns a json callback function. The function Map() is known as a constructor and the JavaScript class that represents a map is the Map class. Objects of this class define a single map on a page. By using the new operator a new instance of this class is created.


#### Technologies

* jQuery get() Method with the Promise interface
* Bootstrap 4 with flex-box layout
* jQuery/VanillaJS/ES6
* HTML/CSS


#### Design Pattern

* Module Pattern to structure JS code


#### My ToDo list 

* Solve issue with option tags in iOS
* Solve issue with clearing option tags when continent buttons are clicked
* Sort issue to display only stations that are open. Problem here is that the returned object doesn't have a prototype to check this.


*********

By: **Joanna Högberg**

Course: **Javascript 2**

Class: **Fend16**

Program: **Front-End Developer at Nackademin**




