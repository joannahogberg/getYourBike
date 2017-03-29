# AJAX Assignment - Open APIs


## getYouBike

Application to display pick-up stations for bikes in selected city https://joannahogberg.github.io/getYourBike/

## Task
- Downloading data from one or more open APIs serving data as JSON.
- Showcasing retrieved data in a structured way in html.
- Good code structure where you use namespaces and clearly separates the parts of your code logically.
- Implementing the project independently and show that you master what you have written.
- Have good understanding of AJAX and asynchronous communication and how to work asynchronously in JavaScript.

#### APIs
The API's used for this application:

* RESTful Countries API: https://restcountries.eu/rest/v2/region/europe returnes an array of json data objects with information for all countries in Europe. Used to get country codes.
* CityBikes API: https://api.citybik.es/v2/ returns an array of json data objects with all companies that are connected to CityBikes.
* Google Maps API: https://maps.googleapis.com/maps/api/ which responds with a json callback function from googlemaps.

#### Ajax calls 
The app uses jQuery get() Method with the Promise interface to load data from the APIs.

1. When the buttons are clicked, the first request is sent to the https://restcountries.eu/rest/v2/region/ + (value that is received from the button element). The done Promise then loops through the objects properties and pushes the country code value into the countries array and calls the appendList function. A loader is applied to notice the user that the page is loading untill the second call is done.

2. The appendList function calls the second api https://api.citybik.es/v2/networks. The done Promise here loops through the properties of the response and then loops through the each objects values. Then a jQuery utility function is used to check whether the objects exists in the countries array or not. If true the cities are appended to the select element as options. The loader is removed when the done Promise is successful.

3. The third call is made to the  https://api.citybik.es/v2/networks/ filtered on selected city's id to get the positioning of each station and then apply markers on a google map for each of the stations in selected city.



#### Technologies

* jQuery get() Method with the Promise interface
* Bootstrap 4 with flex-box layout
* jQuery/VanillaJS
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




