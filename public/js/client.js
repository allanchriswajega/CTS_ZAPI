function listen (){

	// Get context with jQuery - using jQuery's .get() method.

	var data;
	var ctx = $("#myChart").get(0).getContext("2d");
// This will get the first returned node in the jQuery collection.
 var i = 10;
	var data = {
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
	var myLineChart = new Chart(ctx).Line(data);



	var socket =io.connect();
	var $message = $('#message');

	//--------Welcomoe message from the server ---------------------------
	socket.on('welcome',function(data){
		var nosw = new Date();


		$message.append('>>'+String(nosw)+' >>'+data+'\n');
		i = i + 10;
		//myLineChart.addData([i], new Date().getTime());
	});
	//----------------------END OF CODE ----------------------------------


	//--------------------NEW DATA FROM THE AEROPLANE --------------
	socket.on('new_data', function(data){
		var obj = JSON.parse(JSON.stringify(data));
		//myLineChart.addData([i], new Date().getTime());
		myLineChart.addData([obj.spd], new Date().getTime());

	});


	//------------------------END OF CODE -------------------------------

}


