  var socket = io();
  socket.on('connect', function(){

  });

  var msgform = document.getElementById('msgform');

  msgform.addEventListener('submit', function(e){
    e.preventDefault();
    socket.emit('msg', this.message.value);
    this.message.value = '';
  });

  socket.on('msg', function(message){
    var list = document.getElementById('list');
    var line = document.createElement('li');
    list.appendChild(line);
    var nickname = document.createElement('span');
    nickname.innerText =  message.userId + ' : ' + message.txt;
    line.appendChild(nickname);
  });

  var usersUl = document.querySelector('#users ul');
  socket.on('users', function(users){
    var name = document.getElementById('name');
    usersUl.innerHTML = users.map(u => '<li>' + u.nickname + '</li>').join('');
  });


