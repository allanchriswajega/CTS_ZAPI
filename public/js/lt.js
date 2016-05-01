/**
 * Created by HP on 5/1/2016.
 */
function listen(){
    
    
    //connecting to socket.io
    var socket =io.connect();

    socket.on('new_data', function(data){
        var obj = JSON.parse(JSON.stringify(data));

    
        var coords =new google.maps.LatLng(obj.le,obj.lg);

        var mapOptions = {
            zoom: 16,
            center: coords,


        }

        //Creating Map
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //create a marker
        var marker = new google.maps.Marker({map:map, position:coords,label:"Location"})

    });
    
    
}