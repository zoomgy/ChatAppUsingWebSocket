import { ChatRoom } from "./ChatRoom.js";


export default class ChatController{
    chatRooms = [];

    createNewChatRoom = (socket,nameOfTheChatRoom,username)=>{
        const alreadyExistingRoom = this.chatRooms.find((chat)=>(chat.name===nameOfTheChatRoom));
        if(alreadyExistingRoom){
            socket.send(JSON.stringify({
                type : "error",
                error : "Room Already Exists use addtoroom to join the room".toLowerCase()
            }))
        }else{
            const chatRoom = new ChatRoom(socket,nameOfTheChatRoom,username);
            this.chatRooms.push(chatRoom);
            socket.send(JSON.stringify({
                type : "roomcreated",
                value : nameOfTheChatRoom,
                username
            }))
        }
    }

    handleUser = (message,userWebSocket,chatname,username) => {
        const chatRoom = this.chatRooms.find((chatRoom)=>chatRoom.name === chatname);
        if(chatRoom){
            chatRoom.newMessage(message,userWebSocket,username);
        }else{
            userWebSocket.send(JSON.stringify({
                type : "error",
                value : "No Room With This Name Exists Create New Room By Using newroom Or Join Already Existing Room Using addtoroom".toLowerCase()
            }))
        }
    }

    addToExistingChat = (userWebSocket,chatname,username)=>{
        const chatRoom = this.chatRooms.find((chatRoom)=>chatRoom.name === chatname);
        if(chatRoom){
            chatRoom.addUserToThisChat(userWebSocket,username);
            userWebSocket.send(JSON.stringify({
                type : "roomcreated",
                value : chatname,
                username
            }))
        }else{
            userWebSocket.send(JSON.stringify({
                type : "error",
                value : "No Room With This Name Exists Create New Room By Using newroom Or Join Already Existing Room Using addtoroom".toLowerCase()
            }))
        }
    }

    printChat = (socket,chatname)=>{
        console.log(chatname);
        const chatRoom = this.chatRooms.find((chatRoom)=>chatRoom.name === chatname);
        if(chatRoom){
            socket.send(JSON.stringify(
                {
                    type : "printchat",
                    messages : chatRoom.messages
                }    
            ));
        }else{
            socket.send(JSON.stringify({
                type : "error",
                value : "No Room With This Name Exists".toLowerCase()
            }))
        }
    }
}