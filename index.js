const uuid = require('uuid/v4');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const settings = require('./settings')

const port = 8080;

// Instanciation du serveur web, de Express et de Socket.io
const app = express();
const server = http.Server(app);
const io = socketio(server);
//on précise quel port le serveur va écouter
server.listen(settings.port, () => {
  console.log('Listening on port ' + settings.port);
});

// Contenu du dossier public accessible sur le web
app.use('/', express.static(__dirname + '/public'));

const users = [];
io.on('connection', function (socket) {
  
  const user = {
  	id: socket.id,
  	nickname: settings.defaultNicknames[Math.floor(Math.random() * settings.defaultNicknames.length)]
	};
  users.push(user);
  io.emit('users', users);
  console.log('connecté', user.nickname)

 	socket.on('disconnect', function () {
 		users.splice(users.indexOf(user), 1);
    io.emit('users', users);
    console.log('déconnecté', user.nickname);
  });


  const date = Date.now()
  socket.on('msg', function (txt) {
  	const message = {
  			id: uuid(),
  			userId: user.nickname,
  			txt: txt,
  			date: moment(date).format('DD/MM/YYYY à HH:mm')
  		}
	  console.log('Le message', message.txt,"avec l'ID: ", message.id, " envoyé par: ", message.userId, ' a été envoyé le : ', message.date);
	  io.emit('msg', message);
  });


});





/*//socket détecte la connexion au port avec 'connection'
io.on('connection', function (socket) {
	//le serveur écoute si le client à envoyé un chatping
  socket.on('chatping', function () {
  	//il envoie en retour un chatpong
  	socket.emit('chatpong');
  });
});*/