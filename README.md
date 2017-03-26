# getYouBike

Application to display pick-up stations for bikes in selected city https://joannahogberg.github.io/getYourBike/

## Task
- Downloading data from one or more open APIs serving data as JSON.
- Showcasing retrieved data in a structured way in html.
- Good code structure where you use namespaces and clearly separates the parts of your code logically.
- Implementing the project independently and show that you master what you have written.
- Have good understanding of AJAX and asynchronous communication and how to work asynchronously in JavaScript.

#### Ajax calls – APIs
The app uses jQuery get() Method with the Promise interface to load data from three different APIs.

1. When the buttons are clicked, the first request is sent to the https://restcountries.eu/rest/v2/region/ + (value that is received from the button element). The response is returned in JSON format. The done Promise then loops through the objects properties and pushes the country code value into the countries array and calls the appendList function.

2. The appendList function calls the second api https://api.citybik.es/v2/networks which also returns a respons in json format, The done Promise here loops through the properties of the response and the loops through the each objects values. Then a jQuery utility function is used to check whether the objects exists in the countries array or not. If true the cities are appended to the select element as options.

3. The third call is made to the  https://api.citybik.es/v2/networks/ filtered on selected city's id to get the positioning of each station.
4. The last api used is https://maps.googleapis.com/maps/api/ which responds with a json callback function from googlemaps. 



#### My ToDo list 
