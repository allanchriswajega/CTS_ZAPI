function listen (){
var socket =io.connect();
	var $message = $('#message');

	socket.on('welcome',function(data){
		$message.append(data);

	});

}