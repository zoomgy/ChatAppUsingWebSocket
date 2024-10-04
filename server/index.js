import { WebSocketServer } from 'ws';
import ChatController from './ChatController.js';
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

const chatBot = new ChatController();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if(message.type === "newroom"){
            chatBot.createNewChatRoom(ws,message.chatname,message.username);
        }
        else if(message.type === "newmessage"){
            chatBot.handleUser(message.value,ws,message.chatname,message.username)
        }
        else if(message.type === "addtoroom"){
            chatBot.addToExistingChat(ws,message.chatname,message.username);
        }
        else if(message.type === "printchat"){
            chatBot.printChat(ws,message.chatname);
        }
        else if(message.type === "help"){
            ws.send(JSON.stringify({
                newroom : "To Create New Room and provide a chatname field specifying the name of the room under chatname".toLowerCase(),
                newmessage : "To Send New Message As an existing user of a room and also send room name under chatname".toLowerCase(),
                addtoroom : "To join an existing room and also send room name under chatname".toLowerCase(),
                printchat : "to print the chat of a room and also send room name under chatname".toLowerCase(),
                help : "to print this dialogue box again".toLowerCase()
            }))
        }
        else{
            ws.send(JSON.stringify({
                type : "error",
                error : "Wrong Message Type send {'type':'help'} to get all the commands".toLowerCase()
            }))
        }
  });

  ws.send(JSON.stringify({
    type : "greeting",
    value : "Hello and wecome to chatbot".toUpperCase()
  }));
});