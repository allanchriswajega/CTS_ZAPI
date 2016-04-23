function listen (){
var socket =io.connect();
	var $message = $('#message');


	socket.on('welcome',function(data){
		var nosw = new Date();
		init();
		$message.append('>>'+String(nosw)+' >>'+data+'\n');

	});

}



var init = function () {
	var graphdef = {
		categories : ['uvCharts', 'Matisse', 'SocialByWay'],
		dataset : {
			'uvCharts' : [
				{ name : '2008', value: 15},
				{ name : '2009', value: 28},
				{ name : '2010', value: 42},
				{ name : '2011', value: 88},
				{ name : '2012', value: 100},
				{ name : '2013', value: 143}
			],
			'Matisse' : [
				{ name : '2008', value: 15},
				{ name : '2009', value: 28},
				{ name : '2010', value: 42},
				{ name : '2011', value: 88},
				{ name : '2012', value: 100},
				{ name : '2013', value: 143}
			],
			'SocialByWay' : [
				{ name : '2008', value: 15},
				{ name : '2009', value: 28},
				{ name : '2010', value: 42},
				{ name : '2011', value: 88},
				{ name : '2012', value: 100},
				{ name : '2013', value: 143}
			]
		}
	};
	var ChartObject = uv.chart('Pie',graphdef);

}