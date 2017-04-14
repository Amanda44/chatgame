  var socket = io();
  socket.on('connect', function(){

  });

  var msgform = document.getElementById('msgform');
// e = instance d'un event, contient un event navigateur 
  msgform.addEventListener('submit', function(e){
    e.preventDefault();
    var txt = this.message.value;
    // version regex
    //if(/^\/nick /.test(txt)){}
    if (txt.indexOf("/nick") === 0){
      var pseudo = txt.substr(6)
      socket.emit("nick", pseudo)
    }
    else{
      socket.emit('msg', txt);
    }

    this.message.value = '';
  });


  socket.on('msg', function(message){
    var list = document.getElementById('list');
    var blocEl = document.createElement('div');
    blocEl.id = "bloc";
    blocEl.height = "50";
    blocEl.width = "50";
    blocEl.position = "absolute";
    blocEl.style.colorBackground = "red";
    list.appendChild(blocEl);
    var line = document.createElement('li');
    blocEl.appendChild(line);
    var nickname = document.createElement('span');
    var user = users.filter(function(user) {
    return user.id === message.userId;
    })[0];
    nickname.innerText = user.nickname + ': ' + message.txt;
    pseudo = user ? user.nickname : '😄';
    line.appendChild(nickname);
    // Scroll en bas de la liste
    list.scrollTop = list.scrollHeight - list.clientHeight;

    // Affichage de la bulle à côté du user
  var bubble = document.querySelector('#user-' + socket.id + ' .bubble');
  if (bubble) {
    // Annulation du setTimeout précédent s'il y en a un
    clearTimeout(bubble.getAttribute('data-timeout'));
    
    // Affichage de la bulle avec le texte du message
    bubble.style.display = 'block';
    bubble.innerText = message.txt;
    
    // Délai avant de cacher la bulle à nouveau
    var timeout = setTimeout(function() {
      bubble.style.display = 'none';
    }, 2000);
    bubble.setAttribute('data-timeout', timeout);
  }
});

  var usersUl = document.querySelector('#users ul');
  var users = [];
  socket.on('users', function(_users){

    // Liste des anciens ids de users pour supprimer les <div> des users déconnectés
    var oldIds = users.map(function(u) {
    return u.id;
    });

    users = _users;
    usersUl.innerHTML = users.map(u => '<li>' + u.nickname + '</li>').join('');

    // Affichage des users à l'écran selon leurs positions
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    // Suppression de l'id du user de la liste des anciens ids
    var oldIdIndex = oldIds.indexOf(user.id);
    if (oldIdIndex !== -1) {
      oldIds.splice(oldIdIndex, 1);
    }
    var userDiv = document.getElementById('user-' + user.id);
    var nickDiv;
    // Si le <div> du user n'existe pas encore, on le crée
    if (!userDiv) {
      // Div à positionner
      userDiv = document.createElement('div');
      userDiv.id = 'user-' + user.id;
      userDiv.className = 'user';
      
      // Nickname
      nickDiv = document.createElement('span');
      userDiv.appendChild(nickDiv);
      
      // Bulle de texte
      var bubble = document.createElement('p');
      bubble.className = 'bubble';
      bubble.style.display = 'none'; // cachée au début
      userDiv.appendChild(bubble);
      
      // Affichage du <div>
      document.body.appendChild(userDiv);
    } else {
      nickDiv = userDiv.getElementsByTagName('span')[0];
    }
    
    // Mise à jour du nickname
    nickDiv.innerText = user.nickname;
    
    // Mise à jour de la position
    userDiv.style.left = user.position.x + '%';
    userDiv.style.top = user.position.y + '%';
  }
  
  // Suppression des anciens users
  for (var i = 0; i < oldIds.length; i++) {
    var userDiv = document.getElementById('user-' + oldIds[i]);
    if (userDiv) {
      userDiv.parentNode.removeChild(userDiv);
    }
  }
});

  var body = document.body;
  body.addEventListener('click', function(e){
    // On ne tient pas compte du click si on clique sur un <input>
    if (e.target.tagName === 'INPUT') return;
    var position = {
    x: e.clientX/window.innerWidth * 100,
    y: e.clientY/window.innerHeight * 100
  };
    console.log(position);
    socket.emit('move', position);
  });


