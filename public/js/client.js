function listen (){

	// Get context with jQuery - using jQuery's .get() method.




	
// This will get the first returned node in the jQuery collection.

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


	//airspeeb line chart
	var ctx1 = document.getElementById("myChart1").getContext("2d");
	var myLineChart1 = new Chart(ctx1).Line(data1);





	var socket =io.connect();
	var $message = $('#message');

	//--------Welcomoe message from the server ---------------------------
	socket.on('welcome',function(data){
		var nosw = new Date();


		$message.append('>>'+String(nosw)+' >>'+data+'\n');

	});
	//----------------------END OF CODE ----------------------------------


	//--------------------NEW DATA FROM THE AEROPLANE --------------
	socket.on('new_data', function(data){
		var obj = JSON.parse(JSON.stringify(data));

		//speed graph
		myLineChart1.addData([obj.spd], new Date().getTime());


	});

	//------------------------END OF CODE -------------------------------

}



