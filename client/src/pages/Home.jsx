import React, { useState, useEffect, useRef } from 'react'
import generateUniqueId from 'generate-unique-id';

const webSocketConnection = new WebSocket("https://chatappusingwebsocket.onrender.com");

function Home() {
    const [messages, setMessages] = useState([]);
    const [sendingMessage, setSendingMessage] = useState("");
    const [data, setData] = useState("");
    const [error, setError] = useState(null);
    const [room, setRoom] = useState(null);
    const [username, setUsername] = useState("");

    // Reference for the chat container
    const chatContainerRef = useRef(null);

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (error) { setTimeout(() => { setError(null) }, 3000); }

    webSocketConnection.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.type === "error") {
            setError(message.value || message.error);
        }
        if (!room && message.type === "roomcreated") {
            setRoom(message.value);
            webSocketConnection.send(JSON.stringify({
                type: "printchat",
                chatname: message.value
            }));
        }
        if (message.type === "printchat") {
            setMessages(message.messages);
        }
        if (message.type === "message") {
            webSocketConnection.send(JSON.stringify({
                type: "printchat",
                chatname: room
            }));
        }
    };

    const handleSendingMessage = (event) => {
        event.preventDefault();
        if (sendingMessage === "") return;
        const message = {
            type: "newmessage",
            value: sendingMessage,
            username: username,
            chatname: room,
        };
        console.log(message);
        webSocketConnection.send(JSON.stringify(message))
        setSendingMessage("");
    }

    const handleSubmit = (event) => {
        setError(null);
        event.preventDefault();
        if (data === "") return;
        let message = {
            type: event.target.id,
            chatname: data,
            username: `user${new Date().getTime()}`
        }
        setUsername(message.username);
        console.log(`Your Username is: ${message.username}`);
        webSocketConnection.send(JSON.stringify(message));
    }

    return (
        <div className='text-slate-300 w-full h-screen bg-slate-800 flex justify-center items-center flex-col'>
            {room ?
                <div className='p-1 h-full w-full sm:w-11/12 rounded-lg bg-slate-600 sm:p-5 flex flex-col gap-3 justify-center items-center'>
                    <div className='bg-slate-800 w-full h-5/6 rounded-lg flex justify-center flex-col items-center overflow-y-auto'>
                        {messages.length > 0 ?
                            <div className='text-xs md:text-xl gap-1 p-1 md:p-5 w-full h-full flex flex-col md:gap-2'>
                                {messages.map((singlemessage) => (
                                    <div className={singlemessage.username === username ? `w-full flex justify-end` : `w-full flex justify-start`} key={generateUniqueId()}>
                                        <div className={'p-1 w-full md:w-2/3 rounded-lg bg-slate-500 md:p-3 flex flex-col'}>
                                            <span className='rounded-lg text-slate-900'>{singlemessage.username === username ? "ME" : `${singlemessage.username}`}</span>
                                            <span className='p-1 md:p-2 rounded-lg bg-slate-800'>{singlemessage.content}</span>
                                        </div>
                                    </div>
                                ))}
                                {/* Empty div used for scrolling */}
                                <div ref={chatContainerRef} />
                            </div>
                            : <p className='text-xs sm:text-3xl text-slate-400'>No Messages Yet</p>}
                    </div>
                    <div className='bg-slate-800 w-full sm:h-1/6 rounded-lg'>
                        <form onSubmit={handleSendingMessage} className='p-1 w-full h-full sm:p-3 flex gap-3 justify-center items-center'>
                            <input onChange={(event) => setSendingMessage(event.target.value)} value={sendingMessage} className='w-4/5 p-1 text-xs sm:p-3 bg-slate-500 sm:w-1/2 sm:h-1/2 sm:text-xl rounded-lg focus:outline-none' type="textarea" />
                            <button className='text-xs sm:text-xl bg-blue-600 w-1/6 h-1/2 p-3 rounded-lg flex justify-center items-center hover:opacity-70 hover:text-slate-50'>Send</button>
                        </form>
                    </div>
                </div>
                : <div className='max-w-3xl flex flex-col justify-center items-center bg-slate-700 p-5 rounded-lg transition-all'>
                    <form className='flex flex-col gap-3'>
                        <input value={data} onChange={(event) => (setData(event.target.value))} placeholder='RoomName' type="text" className='transition-all hover:p-5 text-center bg-slate-600 p-3 rounded-lg text-2xl text-slate-300 focus:outline-none' />
                        <button onClick={handleSubmit} id="addtoroom" className='transition-all p-3 text-2xl bg-slate-600 rounded-lg hover:bg-slate-900 hover:text-slate-200 hover:p-5'>Join an existing room</button>
                        <button onClick={handleSubmit} id="newroom" className='transition-all p-3 text-2xl bg-slate-600 rounded-lg hover:bg-slate-900 hover:text-slate-200 hover:p-5 w-full'>Create a new Room</button>
                    </form>
                </div>}
            {error && <code className='text-red-600 text-center mt-5'>{error}</code>}
        </div>
    )
}

export default Home
