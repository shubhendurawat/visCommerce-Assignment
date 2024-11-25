import React, { useEffect, useRef, useState } from "react";
import { userConversation } from '../../Zustand/useConversation';
import { useAuth } from "../../context/AuthContext.jsx";
import { FaMessage } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from '../../assets/sound/notification.mp3'


const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setSelectedConversation, setMessage } = userConversation();
    const { socket } = useSocketContext();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSendData] = useState("");
    const lastMessageRef = useRef();

    useEffect(()=> {
        socket?.on("newMessage", (newMessage) => {
            const sound = new Audio(notify);
            sound.play();
            setMessage([...messages, newMessage])
        })

        return ()=> socket?.off("newMessage");
    }, [socket, setMessage, messages])


    useEffect(()=> {
        setTimeout(() => {
            lastMessageRef?.current?.scrollIntoView({behaviour: "smooth"})
        }, 100);
    }, [messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`/api/v1/message/${selectedConversation?._id}`);
                const data = await get.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setMessage(data);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessage])

    const handleMessage = (e) => {
        setSendData(e.target.value)
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await axios.post(`/api/v1/message/send/${selectedConversation._id}`, {messages:sendData});
            const data = res.data; 
            if(data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSendData('');
            setMessage([...messages, data])
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }


    return (
        <>
            <div className="md:min-w-[500px] h-[98%] flex flex-col py-2">
                {selectedConversation === null ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="px-4 text-center text-2xl font-semibold flex flex-col items-center gap-2">
                            <p className="text-2xl flex gap-2 text-yellow-400">Welcome! <span className="drop-shadow-md text-cyan-300">{authUser.username} 😄</span></p>
                            <p className="text-lg text-gray-50">Select a chat to start conversation</p>
                            <FaMessage className="text-6xl text-center text-gray-50" size={25} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between gap-1 bg-yellow-400 md:px-2 rounded-lg h-10 md:h-12">
                            <div className="flex gap-2 md:justify-between items-center w-full">
                                <div className="md:hidden ml-1 self-center">
                                    <button onClick={() => onBackUser(true)} className="bg-white rounded-full px-2 py-1 self-center">
                                        <FaArrowLeft />
                                    </button>
                                </div>
                                <div className="flex justify-between mr-2 gap-2">
                                    <img className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer border-2 border-white" src={selectedConversation?.profilePic} />
                                    <span className="text-black self-center text-sm md:text-xl font-bold">{selectedConversation?.username}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {loading && (
                                <div className="loading loading-spinner"></div>
                            )}
                            {
                                !loading && messages?.length === 0 && (
                                    <p className="text-center text-gray-50 items-cente">Send a message to start conversation</p>
                                )}
                            {
                                !loading && messages?.length > 0 && messages?.map((message) => (
                                    <div className="text-gray-50" key={message?._id} ref={lastMessageRef}>
                                        <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                                            <div className="chat-image avatar"></div>
                                            <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-yellow-400 text-black mt-4' : 'chat-start'}`}>
                                                {message?.message}
                                            </div>
                                            <div className="chat-footer text-[10px] opacity-90 text-gray-50">
                                                {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                                                {new Date(message?.createdAt).toLocaleDateString('en-IN', { hour: 'numeric', minute: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <form onSubmit={handleSubmit} className="rounded-full text-black"> 
                        <div className="w-full rounded-full flex items-center bg-white">
                            <input value={sendData} onChange={handleMessage} type="text" id="message" className="w-full bg-transparent outline-none px-4 rounded-full" required />
                            <button type="submit">
                                {sending ? <div className="loading loading-spinner"></div>: <IoSend size={25} className="text-gray-50 cursor-pointer rounded-full bg-red-500 border-2 border-white hover:text-yellow-400 hover:bg-black w-10 h-auto p-1" />}
                            </button>
                        </div>
                        </form>
                    </>
                )}
            </div>
        </>
    )
}

export default MessageContainer