function listen (){

	var data1 = {
		labels: [],
		datasets: [
			{
				label: "Aeroplane Speed",
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#cc1229",
				pointHighlightFill: "#cc1229",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			}
		]
	};

    var data2 = {
        labels: [],
        datasets: [
            {
                label: "Aeroplane Speed",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#cc1229",
                pointHighlightFill: "#cc1229",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    };




	//airspeeb line chart
	var ctx1 = document.getElementById("myChart1").getContext("2d");
	var myLineChart1 = new Chart(ctx1).Line(data1);

	//airspeeb line chart
	var ctx2 = document.getElementById("myChart2").getContext("2d");
	var myLineChart2 = new Chart(ctx2).Line(data2);
	
	
	



	//-----------Mapping--------------------

	//------------- END OF CODE -------------




	var socket =io.connect();
	var $message = $('#message');

	//--------Welcomoe message from the server ---------------------------
	socket.on('welcome',function(data){
		var nosw = new Date();


		$message.append('>>'+String(nosw)+' >>'+data+'\n');

	});
	//----------------------END OF CODE ----------------------------------


	//---------------Intialisation of chart ----------------------------
	socket.on('init_data', function(data){
		$message.append('aaaaaaaaaaaaaaaaaaaaaaaa'+'\n');
		$message.append(JSON.stringify(data)+'\n');

		for (var i = 0; i < data.length; i++){

			var obj = JSON.parse(JSON.stringify(data[i]));
			myLineChart1.addData([obj.spd], new Date().getTime());

		}
		//var mdata = JSON.parse(JSON.stringify(data));
		});


	//------------------ END OF CODE ------------------------------------


	//--------------------NEW DATA FROM THE AEROPLANE --------------
	socket.on('new_data', function(data){
		var obj = JSON.parse(JSON.stringify(data));

		//speed graph
		myLineChart1.addData([obj.spd], new Date().getTime());

		myLineChart2.addData([obj.alt], new Date().getTime());

		var coords =new google.maps.LatLng(obj.le,obj.lg);

		var mapOptions = {
			zoom: 16,
			center: coords

		}

		//Creating Map
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);


	});

	//------------------------END OF CODE -------------------------------

}



