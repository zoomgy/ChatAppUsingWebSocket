import Message from "./Message.js";
export class ChatRoom {

    messages = [];
    users = [];
    usernames = [];
    name = "";

    constructor(socket,chatName,username){
        this.users = [];
        this.usernames = [];
        this.users.push(socket);
        this.usernames.push(username);
        this.name = chatName;
    }

    addUserToThisChat = (socketUser,username)=>{
        const existingUser = this.users.find((user)=>(user===socketUser));
        if(existingUser){
            socketUser.send(JSON.stringify({
                type : "error",
                error : "You Already Exist In This Chat, Create New Message By Using newmessage".toLowerCase()
            }))
        }else{
            this.users.push(socketUser);
            this.usernames.push(username);
        }
    }

    newMessage = (message,socketUser,username)=>{
        const user = this.users.find((User)=>User===socketUser);
        if(user){
            const m = new Message(message,user,this.messages.length,username);
            this.messages.push(m);
            this.users.forEach((user)=>{
                user.send(JSON.stringify({
                    type : "message",
                    ...m,
                }));
            })
            
        }else{
            socketUser.send(JSON.stringify({
                type : "error",
                error : "You Do Not Exist In This Chat. First Get Added In the Chat By Using addtoroom".toLowerCase()
            }))
        }
    }
}