var socket = io.connect('http://localhost:8081');

socket.on('connect', function() {

	console.log('socket ready');
	
	socket.emit('adduser', prompt('username:'));
	
	
})

socket.on('updateusers', function(data) {
	
	console.log(data);
	
	$('#users').html('');
	
	$.each(data, function(key, value) {
		$('#users').append('<li>' + key + '</li>');
	});
	

});

socket.on('updatechat', function(username, data) {

	var html = '<dt>' + username + '</dt><dd>' + data + '</dd>';
	
	$('#conversation').prepend(html);

});


$(function(){

	$('#datasend').click(function() {
		var message = $('#data').val();	
		$('#data').val('');
		if(message.length > 0) {
			socket.emit('sendchat', message);
		}
	});
	
	$('#data').keypress(function(e) {
		if(e.keyCode == 13) {
			$(this).blur();
			$('#datasend').focus().click();
			$('#data').focus().click();
		}
	});
	
	



})
