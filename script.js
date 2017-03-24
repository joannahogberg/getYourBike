'Use strict'



const BikeMap = (function() {

    document.getElementById("selContinents").innerHTML = "?";
    let inputElem = document.getElementById("input");

    const url = 'https://api.citybik.es/v2/networks';
    let myLatLng;
    let BikeNetwork = [];
    let errorMsg = document.getElementById("errMsg");


    //Get the value of clicked button using jquery and call BikeMap.getCities with parameter value
    $(document).ready(function() {
        $('#europe').click(function() {
            // alert($(this).attr("value"));
            let value = $(this).attr("value");
            BikeMap.getCities($(this).attr("value"))
                // BikeMap.getCities(value);
                // alert(value)
        });
    });
    $(document).ready(function() {
        $('#america').click(function() {
            // alert($(this).attr("value"));
            let value = $(this).attr("value");
            BikeMap.getCities($(this).attr("value"))
                // BikeMap.getCities(value);
                // alert(value)

        });
    });

    $(function() {
        $('#input').change(function() {
            BikeMap.getBikeDetails($("#selCity option[value='" + $('#input').val() + "']").attr('id'));
        });
    });




    // Google map call to define google
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCpCilSrre3u5TACGa1XjkVHCWGiBDZZ5o&callback=?',
        dataType: 'json',
        jsonCallback: 'BikeMap'
    })




    return {

        getCities: (value) => {

            if (value == "americas") {
                document.getElementById("selContinents").innerHTML = "North and South America";


            } else {
                document.getElementById("selContinents").innerHTML = "Europe";

            }

            //let countries = ["BE", "CH", "CZ", "DK", "DE", "EE", "IE", "GR", "ES", "FR", "GB", "HR", "IT", "IS", "LU", "HU", "MT", "NL", "NO", "AT", "PL", "PT", "FI", "SE"];
            let countries = [];


            console.log(value);

            // Call to RESTful COUNTRIES API with callback function that returns objects in JSON format. 
            $.get("https://restcountries.eu/rest/v2/region/" + value, (country) => {
                // console.log(country);
                errorMsg.innerHTML = "";

                //Loop through the objects and pushes the country codes into the countries array
                for (prop in country) {
                    // console.log(country[prop].alpha2Code);
                    countries.push(country[prop].alpha2Code);
                }

            }).catch(function(error) {
                console.log("There was something wrong with the API...");
                errorMsg.innerHTML = "Try click again ;)";
                //     //Backup for API
                // countries = ["BE", "CH", "CZ", "DK", "DE", "EE", "IE", "GR", "ES", "FR", "GB", "HR", "IT", "IS", "LU", "HU", "MT", "NL", "NO", "AT", "PL", "PT", "FI", "SE"];
            });

            // const url = 'http://api.citybik.es/v2/networks';
            // var BikeNetwork = [];

            // Call to CityBikes API with callback function. Returns all bikeNetwork objects in JSON format
            $.get(url, (companies) => {
                console.log(companies);
                errorMsg.innerHTML = "";
                $('input[type=text]').attr('placeholder', 'Select city from list');
                BikeNetwork = companies;

                let selCityElem = document.getElementById("selCity");
                selCityElem.innerHTML = "";
                for (prop in companies) {

                    const arr = companies[prop];

                    for (var i = 0; i < arr.length; i++) {


                        let location = arr[i].location;


                        let code = location.country;
                        //jQuery utility function to find whether an element exist in array or not
                        if ($.inArray(code, countries) != -1) {

                            // companyId.push(arr[i].id)
                            //Sets the select option values to each city's name 
                            // selCityElem.innerHTML += `<option value="${arr[i].id}">${location.city} - ${location.country} </option>`;
                            selCityElem.innerHTML += `<option value="${location.city} - ${location.country}" id="${arr[i].id}">${arr[i].id} </option>`;
                        } else {
                            console.log('Country code is not in array');


                        }

                    }

                    // $.get("https://restcountries.eu/rest/v2/alpha?codes=" + location.country, (response) => {
                    //     //     // console.log(response);
                    //     //     for (prop in response) {
                    //     //         // console.log(response[prop].name);
                    //     //         country = response[prop].name;
                    //     //         console.log(country);
                    //     //     }

                    //     // });

                    /**
                     * jQuery plugin to sort values alphabetically in select
                     * source: http://stackoverflow.com/questions/12073270/sorting-options-elements-alphabetically-using-jquery
                     */
                    $.fn.extend({
                        sortSelect() {
                            let options = this.find("option"),
                                arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();

                            arr.sort((o1, o2) => { // sort select
                                let t1 = o1.t.toLowerCase(),
                                    t2 = o2.t.toLowerCase();
                                return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
                            });

                            options.each((i, o) => {
                                o.value = arr[i].v;
                                $(o).text(arr[i].t);
                            });
                        }
                    });
                    $("select").sortSelect();

                }

                // console.log(companyId);
            }).catch(function(error) {
                console.log(error);
                errorMsg.innerHTML = "Try click again ;)";

            });




        },


        getBikeDetails: (selCityId) => {


            // console.log(selCityId);

            let lat;
            let lng;
            for (prop in BikeNetwork) {
                let arr = BikeNetwork[prop];

                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].location.city == selCityId) {
                        lat = arr[i].location.latitude;
                        lng = arr[i].location.longitude;
                        // console.log(lat, lng);
                        myLatLng = { lat: lat, lng: lng };
                    }
                }

            }
            // for (prop in BikeNetwork) {
            //     let arr = BikeNetwork[prop];
            //     for (let i = 0; i < arr.length; i++) {
            //         if (arr[i].id == selCityId) {
            //             lat = arr[i].location.latitude;
            //             lng = arr[i].location.longitude;
            //             console.log(lat, lng);
            //             myLatLng = { lat: lat, lng: lng };
            //         }
            //     }

            // }
            // BikeMap.getStationLatLng(selCityId)
            BikeMap.initMap(selCityId);



        },


        initMap: (selCityStations) => {


            // alert(selCityStations);
            $.get(url + '/' + selCityStations, (response) => {
                console.log("stations", response);
                let locations = [];
                for (prop in response) {

                    const stations = response[prop].stations;
                    for (let i = 0; i < stations.length; i++) {
                        locations.push([stations[i].latitude, stations[i].longitude, stations[i].name, stations[i].free_bikes]);

                    }
                }

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
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    center: myLatLng,

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
                    console.log(locations[i])
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

            });
            document.getElementById("input").addEventListener("click", BikeMap.deleteVal);
        },
        //Clear the input field when clicked
        deleteVal: () => {

            inputElem.value = "";

        },

        chooseContinent: () => {

            // //Get the value of clicked button using jquery and call BikeMap.getCities with parameter value
            // $(document).ready(function() {
            //     $('#europe').click(function() {
            //         // alert($(this).attr("value"));
            //         let value = $(this).attr("value");
            //         BikeMap.getCities($(this).attr("value"))
            //             // BikeMap.getCities(value);
            //             // alert(value)
            //     });
            // });
            // $(document).ready(function() {
            //     $('#america').click(function() {
            //         // alert($(this).attr("value"));
            //         let value = $(this).attr("value");
            //         BikeMap.getCities($(this).attr("value"))
            //             // BikeMap.getCities(value);
            //             // alert(value)

            //     });
            // });

            // document.getElementById("selCity").addEventListener("change", BikeMap.getBikeDetails);
            // document.getElementById("selCity").addEventListener("input", BikeMap.getBikeDetails);


            // $(function() {
            //     $('#input').change(function() {
            //         BikeMap.getBikeDetails($("#selCity option[value='" + $('#input').val() + "']").attr('id'));
            //     });
            // });
        }
    }

})();

// document.getElementById("selCity").addEventListener("change", BikeMap.getBikeDetails);
// BikeMap.getCities();
// BikeMap.chooseContinent();