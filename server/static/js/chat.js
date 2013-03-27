			var socket = io.connect('http://localhost:8081');
			var currentUsername;

			// on connection to server, ask for user's name with an anonymous callback
			socket.on('connect', function() {
				// call the server-side function 'adduser' and send one parameter (value of prompt)
				if(!currentUsername) {
					currentUsername = prompt("What's your name?");
				}
				socket.emit('adduser', currentUsername);
			});

			// listener, whenever the server emits 'updatechat', this updates the chat body
			socket.on('updatechat', function(username, data) {
			
				// $('#conversation').prepend('<b>' + username + ':</b> ' + data + '<br>');
				if(currentUsername == username) {
					var html = '<dt class="self">' + username + '</dt><dd>' + data + '<dd>';
				} else {
					var html = '<dt>' + username + '</dt><dd>' + data + '<dd>';
				}

				$('#conversation').prepend(html);
			});

			// listener, whenever the server emits 'updateusers', this updates the username list
			socket.on('updateusers', function(data) {
				$('#users').empty();
				$.each(data, function(key, value) {
					$('#users').append('<li>' + key + '</li>');
				});
			});

			// on load of page
			$(function() {
				// when the client clicks SEND
				$('#datasend').click(function() {
					var message = $('#data').val();
					$('#data').val('');
					// tell server to execute 'sendchat' and send along one parameter
					if(message.length > 0) {
						socket.emit('sendchat', message);
					}
				});

				// when the client hits ENTER on their keyboard
				$('#data').keypress(function(e) {
					if (e.which == 13) {
						$(this).blur();
						$('#datasend').focus().click();
						$('#data').focus().click();
					}
				});
			});