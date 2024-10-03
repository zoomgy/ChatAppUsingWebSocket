export default class Message{

    content = "";
    author = null;
    messageNumber = 0;
    username = "";

    constructor(message,socketUser,messageNumber,username){
        this.content = message;
        this.author = socketUser;
        this.messageNumber = messageNumber;
        this.username = username;
    }
    
    get(){
        return {
            author:this.author,
            content:this.content,
            messageNumber:this.messageNumber
        }
    }
}