var styleColor = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#193341"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c5a71"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#29768a"
            },
            {
                "lightness": -37
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#406d80"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#406d80"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#3e606f"
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.84
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "weight": 0.6
            },
            {
                "color": "#1a3541"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c5a71"
            }
        ]
    }
];


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var counter = 0;

var map;

function initialize() {
    var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(46, 76),
        styles: styleColor
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
            'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;



/**
 * 
 * @type WebSocket
 */

var ws = new WebSocket("ws://localhost:8084/TwitterSocket/TwitterStream");

ws.onopen = function() {
};

ws.onmessage = function(message) {
    var lats = message.data.split("=")[0];
    var str = message.data.split("=")[1];
    var messageStr = str.split(":")[0];
    var from = str.split(":")[1];
    drawMessage(messageStr, from);
    var latitude = parseFloat(lats.split(":")[0]);
    var longitude = parseFloat(lats.split(":")[1]);
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: message.data.split("=")[1],
        icon: 'images/marker.png'
    });
    var msg = "<div>" + messageStr + "<br><br>     <span style='color:red;'>" + from + "</span></div>";
    var infowindow = new google.maps.InfoWindow({
        content: msg
    });
    
    setInterval(function(){
        marker.setMap(null);
    },"6000");
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
};


function closeConnect() {
    ws.close();
}



/**
 * 
 * SCROLL AND LIST UPDATE 
 */

$(function() {
    $('#right').slimScroll({
        height: '600px'
    });
});

function drawMessage(message, from) {
    $("#right ul li:last").after('<li><div class="message">' + message + '</div><div class="author">' + from + '</div> </li>');
    counter++;
    if (counter > 50) {
        $("#right ul li:first").remove();
    }
    var itemContainer = $("#right");
    var scrollTo_int = itemContainer.prop('scrollHeight') + 'px';
    itemContainer.slimScroll({
        scrollTo: scrollTo_int,
        height: '200px',
        start: 'bottom',
        alwaysVisible: true
    });
}

