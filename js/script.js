'Use strict'

/*
Module Pattern 
github: https://github.com/joannahogberg/getYourBike
link: https://joannahogberg.github.io/getYourBike/
*/

const BikeMap = (function() {

    //Variable declarations for html elements
    let selContElem = document.getElementById("selContinents");
    let selCityInfo = document.getElementById("selCityInfo");
    let datalist = document.getElementById("selCity");
    let loader = document.getElementById("loader");
    let mapLoader = document.getElementById("mapLoader");
    let inputElem = document.getElementById("input");
    let selElem = document.getElementById("options");
    let mapInfoElem = document.getElementById("mapInfoText");
    selElem.innerHTML = "";


    //Global variable declarations
    let myLatLng;
    let BikeNetwork = [];
    let allCompanies;
    let val;
    let companyName;
    let countryNames;
    let countryName;


    //Url link to citybik API
    const url = 'https://api.citybik.es/v2/networks';


    /**
     * Functions for buttons that loads when window is ready
     * Get the value of clicked button using jquery and call BikeMap.getCountryCodes with parameter value
     */
    $(document).ready(function() {
        $('#europe').click(function() {
            // alert($(this).attr("value"));
            let value = $(this).attr("value");
            BikeMap.getCountryCodes(value)

        });
        $('#america').click(function() {
            let value = $(this).attr("value");
            BikeMap.getCountryCodes(value)

        });
    });


    // Google map call which responds with a json callback function from googlemaps. API key to be able to respond back
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCpCilSrre3u5TACGa1XjkVHCWGiBDZZ5o&callback=?',
        dataType: 'json',
        jsonCallback: 'BikeMap'
    })



    return {

        /**
         * Function with jQuery.get() request to load data from API
         * @param {String}         Selected continents value 
         */


        getCountryCodes: (value) => {


            // Call to RESTful COUNTRIES API with callback function that returns objects in JSON format. 
            $.get("https://restcountries.eu/rest/v2/region/" + value, (countries) => {
                    console.log("success");
                    countryNames = countries;
                    document.getElementById("map").innerHTML = "";
                    document.getElementById("map").style.height = "0";

                })
                .done((countries) => {
                    console.log("finished");
                    selContElem.innerHTML = "";
                    selCityInfo.innerHTML = "Please wait while information is loading";
                    loader.src = 'pics/loader.gif';
                    loader.style.height = '250px';
                    BikeMap.addCountryCodes(countries)
                }).fail(() => {
                    console.log("error");
                    selCityInfo.innerHTML = "Seems like there is something wrong with your connection :( Please try reloading the page.";
                }).always(() => {
                    console.log("finished");

                });

            val = value;


        },

        /**
         * Function that pushes all county codes into array
         * @param {Object}          All countries from selected continent
         * @return {Array}          Country codes 
         */
        addCountryCodes: (countries) => {


            const countriesArr = [];
            for (prop in countries) {


                //Push the country code for each country in selected continent to countries array
                countriesArr.push(countries[prop].alpha2Code);
            }
            //Call to getOptionDetails with parameter countriesArr
            BikeMap.getOptionDetails(countriesArr)
                // BikeMap.getCountryName()



        },
        // getCountryName: () => {

        //     const count = countryNames.map(country =>


        //         console.log(country.name)

        //     )
        // },

        /**
         * Function with jQuery.get() request to load data from API 
         * @param {Array}          Country codes 
         */

        getOptionDetails: (countries) => {


            // Call to CityBikes API with callback function. Returns an object of all bikeNetworks in JSON format
            $.get(url, (companies) => {
                    BikeNetwork = companies;
                    console.log("success");

                })
                .done((companies) => {
                    console.log("finished");
                    BikeMap.appendList(countries);
                })
                .fail(() => {
                    console.log("error");
                    $('input[type=text]').attr('placeholder', 'Could not load cities :(');
                })
                .always(() => {
                    console.log("finished");
                });


        },




        /**
         * Function that assigns allCompanies with an array with objects of all companies in BikeNetwork   
         */
        getAllCompanies: () => {
            for (prop in BikeNetwork) {
                allCompanies = BikeNetwork[prop].map(company =>
                    company)
            }

        },
        /**
         * Function that returns an array of all country codes for all cities in BikeNetwork
         * @return {Array}    
         */
        getCityCountryCode: () => {

            return allCompanies.map(country =>
                country.location.country
            )

        },
        /**
         * Function that return names of cities for whole Network
         * @param {Array}         City names 
         */
        getAllCities: () => {
            return allCompanies.map(city =>
                city.location.city)
        },

        /**
         * Function to append to options to interface
         * @param {Array}          Country codes 
         */

        appendList: (countries) => {
            BikeMap.getAllCompanies()
            mapInfoElem.innerHTML = "";
            inputElem.value = "";


            selElem.innerHTML = `<option  value="- Available Cities -"label="Select City" selected disabled></option>`;
            const code = BikeMap.getCityCountryCode();
            const city = BikeMap.getAllCities();

            for (let i = 0; i < code.length; i++) {
                if ($.inArray(code[i], countries) != -1) {
                    //Remove last value if US state is included in string
                    let cityVal = city[i].split(",")[0];
                    //Set option values
                    selElem.innerHTML += `<option value="${cityVal}" label="${cityVal}">${cityVal}</option>`;
                }
            }
            //Eventhandler added to input element
            document.getElementById("input").addEventListener("change", BikeMap.getBikeDetails);
            BikeMap.sortOptions();
            BikeMap.removeLoader();


        },



        /**
         * Function to remove loader and append information to user
         */

        removeLoader: () => {

            //Remove loader 
            loader.src = '';
            loader.style.height = '0';

            //Check value for selected continent and apply matching text to interface
            if (val == "americas") {
                selContElem.innerHTML = "<h4>Awesome! I'd love traveling to North or South America :)</h4> <p>Below you can search/select among the cities that offer bikes and a map will show with all stations where you can</p><h5>goGetYourBike</h5>";
                selCityInfo.innerHTML = "";

            } else {
                selContElem.innerHTML = "<h4>Europe sounds real nice!</h4> <p>Below you can search/select among the cities that offer bikes and a map will show with all stations where you can</p><h5>goGetYourBike</h5>";
                selCityInfo.innerHTML = "";

            }

        },
        /**
         * Function with jQuery plugin to sort values alphabetically in select
         * source: http://stackoverflow.com/questions/45888/what-is-the-most-efficient-way-to-sort-an-html-selects-options-by-value-while
         */

        sortOptions: () => {

            $.fn.sort_select_box = function() {
                // Get options from select box
                let my_options = $("#" + this.attr('id') + ' option');
                // sort alphabetically
                my_options.sort(function(a, b) {
                        if (a.value > b.value) return 1;
                        else if (a.value < b.value) return -1;
                        else return 0
                    })
                    //replace with sorted my_options;
                $(this).empty().append(my_options);

                // clearing any selections
                $("#" + this.attr('id') + "option").attr('selected', false);
            }

            $('#options').sort_select_box();


        },


        /**
         * Function to check values from input/select and get id for selected city
         */
        getBikeDetails: () => {

            //Clear map
            document.getElementById("map").innerHTML = "";

            // //Get value from selected option for Safari
            const x = document.getElementById("options").selectedIndex;
            let selCityId = document.getElementsByTagName("option")[x].text;
            let selCityId2;
            let selCityId3 = selCityId;

            // Get value from selected option in dataList for Chrome
            for (var i = 0; i < document.getElementById('options').options.length; i++) {
                if (document.getElementById('options').options[i].value == document.getElementsByName("selCity")[0].value) {
                    selCityId2 = document.getElementById('options').options[i].value;
                    break;
                } else if (document.getElementById('options').options[i].value !== document.getElementsByName("selCity")[0].value) {
                    let inputVal = document.getElementById("input").value;
                    mapInfoElem.innerHTML = "Sorry, " + inputVal.toUpperCase() + " doesn't exist in our bike share network. Please make a new search and select from the options available.";
                    selCityId = null;

                }

            }
            const selId = allCompanies.filter(function(city) {
                return city.location.city.split(",")[0] === (selCityId2 || selCityId3);
            });
            let id;
            let countryCode;
            for (prop in selId) {
                countryCode = selId[prop].location.country;
                id = selId[prop].id;
                companyName = selId[prop].company;

            }
            //Call to getStations function with parameter of selected city id
            BikeMap.getStations(id);

            //Filter() method to get name of selected country and assign it to the countryName variable
            countryNames.filter((name) => {

                if (name.alpha2Code == countryCode) {
                    countryName = name.name;
                }
            });


        },

        /**
         * Function with jQuery.get() request to API with filter set to selected network ID load data from API. 
         * Done promise with call to BikeMap.getStationsDetails() function with 
         * @param {String}         Selected city's network id 
         */
        getStations: (selCityStations) => {

            console.log(selCityStations)
            $.get(url + '/' + selCityStations, (allStations) => {
                    // console.log("success");

                })
                .done(function(allStations) {
                    // Activate loader
                    mapLoader.src = 'pics/loader.gif';
                    mapLoader.style.height = '250px';
                    BikeMap.getStationsDetails(allStations);

                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("finished");

                });

        },


        /**
         * Function to set values for selected city 
         * @param {Object}         Selected city 
         */

        getStationsDetails: (allStations) => {

            mapLoader.src = '';
            mapLoader.style.height = '0';

            let locations = [];
            let city;
            let nrOfStations;
            for (prop in allStations) {
                city = allStations[prop].location.city;
                allStations[prop].stations.filter((stat) => {
                    if (stat.free_bikes > 3) {
                        locations.push([stat.latitude, stat.longitude, stat.name, stat.free_bikes]);
                    }
                });

            }

            //Call to createMap function with parameter locations
            BikeMap.createMap(locations, city)

        },


        /**
         * Function to add a styled map to interface with markers for all stations in selected city.
         * @param {array}         Array with all information for each station in selected city
         */

        createMap: (locations, city, nrOfStations) => {


            //Assign a url link to google search with parameter companyname and bike
            const searchUrl = "https://encrypted.google.com/#q=" + companyName[0] + "bike";

            if (locations.length <= 0) {
                mapInfoElem.innerHTML = "Unfortunately there are no available bikes in " + city + " at the moment";
                document.getElementById("map").style.height = "0";


            } else {

                mapInfoElem.innerHTML = city.split(",")[0] + " in " + countryName + ", right now have " + locations.length + " bike stations with available bikes! To find out more here is a link to the Google search for this program: " + '<a target="blank" href="' + searchUrl + '" >' + companyName[0] + '</a>';

                //Styling for map
                var styledMapType = new google.maps.StyledMapType(
                    [{
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#f5f5f5"
                            }]
                        },
                        {
                            "elementType": "labels.icon",
                            "stylers": [{
                                "visibility": "off"
                            }]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#616161"
                            }]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [{
                                "color": "#f5f5f5"
                            }]
                        },
                        {
                            "featureType": "administrative.land_parcel",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#bdbdbd"
                            }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#eeeeee"
                            }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#757575"
                            }]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#e5e5e5"
                            }]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#9e9e9e"
                            }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#ffffff"
                            }]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#757575"
                            }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#dadada"
                            }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#616161"
                            }]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#9e9e9e"
                            }]
                        },
                        {
                            "featureType": "transit.line",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#e5e5e5"
                            }]
                        },
                        {
                            "featureType": "transit.station",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#eeeeee"
                            }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#c9c9c9"
                            }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#9e9e9e"
                            }]
                        }
                    ], {
                        name: 'Styled Map'
                    });


                var bounds = new google.maps.LatLngBounds();
                // Displays a map in the map element
                document.getElementById("map").style.height = "400px";
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    mapTypeControlOptions: {
                        mapTypeIds: ['roadmap', 'satellite', 'hybrid',
                            'styled_map'
                        ]
                    }

                });


                //Associate the styled map with the MapTypeId and set it to display.
                map.mapTypes.set('styled_map', styledMapType);
                map.setMapTypeId('styled_map');

                var infowindow = new google.maps.InfoWindow(),
                    marker;

                // Display multiple markers on a map
                for (var i = 0; i < locations.length; i++) {
                    // console.log(locations[i])
                    var position = new google.maps.LatLng(locations[i][0], locations[i][1]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map
                    });
                    // Attaches an info window to a marker with the provided message. When the
                    // marker is clicked, the info window will open with the set values.
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {

                        return function() {
                            infowindow.setContent("Get your bike at: " + locations[i][2] + "<br> Bikes available: " + locations[i][3]);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));

                }
                // Automatically center the map fitting all markers on the map screen
                map.fitBounds(bounds);
            }

            document.getElementById("input").addEventListener("click", BikeMap.deleteVal);
            //Reset selectedIndex
            document.getElementById("options").selectedIndex = null;
        },
        //Clear the input field when clicked
        deleteVal: () => {

            inputElem.value = "";

        }
    }

})();