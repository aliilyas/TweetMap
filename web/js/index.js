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
        center: new google.maps.LatLng(46, 76)
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
    drawMessage(message.data.split("=")[1], "aaa");
    var latitude = parseFloat(lats.split(":")[0]);
    var longitude = parseFloat(lats.split(":")[1]);
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: message.data.split("=")[1],
        icon: 'images/marker.png'
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

