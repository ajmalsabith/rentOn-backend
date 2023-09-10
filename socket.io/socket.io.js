const socketIO = require('socket.io') 
const dotenv= require('dotenv')

dotenv.config()


function intializeSocket(server) {
    const io = socketIO(server, {
        pingTimeout:60000,
        cors: {
            origin:[process.env.origin]
         },
      });
      

    io.on('connection', (socket) => {
        socket.on('setup', (id) => {
            socket.join(id)
            socket.emit('connected')
            console.log('A user connected');
        });

        socket.on('join', (room) => {
            socket.join(room);
        })

        socket.on('chatMessage', (message,purpose) => {
            console.log(message,"message");
            console.log(purpose+'=purpose');
            if (purpose=='customer') {
                console.log(message.from)

                socket.in(message.to).emit("message recieved", message);

            }else{
                console.log(message.from)
                socket.in(message.to).emit("message recieved", message);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

}



module.exports = intializeSocket