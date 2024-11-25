import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { userConversation } from '../../Zustand/useConversation'
import { useSocketContext } from "../../context/SocketContext.jsx";


const Sidebar = ({ onSelectUser }) => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
    const { onlineUser, socket } = useSocketContext();

    const nowOnline = chatUser.map((user) => (user._id));

    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setNewMessageUsers(newMessage)
        })
        return () => socket?.off("newMessage");
    }, [socket, messages])

    // show users with you chatted
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const chatters = await axios.get('/api/v1/user/currentchatters');
                const data = chatters.data;
                // console.log("data of chatters:", data)
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setChatUser(data);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        chatUserHandler();
    }, []);

    // Show user from the search result
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/user/search?search=${searchInput}`);
            console.log(response);
            const data = response.data;

            if (data.success === false) {
                setLoading(false);
                console.log(data.message);
            } else {
                // Normalize the data: if it's a single object, wrap it in an array
                const users = Array.isArray(data) ? data : [data];
                if (users.length === 0) {
                    toast.info("User Not Found");
                } else {
                    setSearchUser(users); // Ensure searchUser is always an array
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };



    // show which user is selected
    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user._id);
        setNewMessageUsers('');

    };

    // back from search result
    const handleSearchBack = () => {
        setSearchUser([]);
        setSearchInput('');
    }

    // logout function
    const handleLogOut = async () => {
        const confirmLogOut = window.prompt("type 'Username' to Logout")
        if (confirmLogOut === authUser.username) {
            setLoading(true);
            try {
                const logout = await axios.post('/api/v1/auth/logout');
                const data = logout.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                toast.info(data.message)
                localStorage.removeItem('visCommerce.chat')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        } else {
            toast.info("Logout cancelled")
        }

    }

    return (
        <div className="h-full w-auto px-1 border-r-2">
            <div className="flex justify-between gap-5">
                <form onSubmit={handleSearchSubmit} className="w-auto flex items-center justify-between bg-white rounded-full mt-6">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type="text"
                        className="px-4 w-auto bg-transparent outline-none rounded-full"
                        placeholder="Search users"
                    />
                    <button className="btn btn-circle text-black bg-yellow-400 hover:bg-gray-950 hover:text-yellow-400">
                        <FaSearch />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilePic}
                    className="self-center h-12 w-12 hover:scale-110 cursor-pointer mt-6 border-2 border-gray-50 rounded-full"
                />
            </div>
            <div className="divider px-3 mt-8"></div>
            {/* Display search results */}
            {searchUser && searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className="w-auto">
                            {searchUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handleUserClick(user)}
                                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user._id ? 'bg-transparent border-2 border-yellow-400 rounded-md pt-2 py-2' : ''}`}
                                    >
                                        <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                            <div className="w-12 rounded-full">
                                                <img src={user.profilePic} alt="user.img" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <p className="font-bold text-gray-950">{user.username}</p>
                                        </div>
                                    </div>
                                    <div className="divider divide-solid px-3 h-[1px]"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto px-1 py-1 flex">
                        <button onClick={handleSearchBack} className="bg-yellow-400  flex rounded-full px-2 py-1 self-center hover:bg-black hover:text-gray-50">
                            <FaArrowLeft size={25} /> Back
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
                        <div className="w-auto">
                            {chatUser.length === 0 ? (
                                <>
                                    <div className="font-bold items-center flex flex-col text-xl text-yellow-400">
                                        <h1>Why are you alone</h1>
                                        <h1>Search Username to chat</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handleUserClick(user)}
                                                className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user._id ? 'bg-transparent border-2 border-yellow-400 rounded-md pt-2 py-2' : ''}`}
                                            >
                                                <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                                    <div className="w-12 border-2 border-yellow-400 rounded-full h-12">
                                                        <img src={user.profilePic} alt="user.img" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <p className="font-bold text-gray-50 ">{user.username}</p>
                                                </div>
                                                <div>
                                                    { newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                    <div className="rounded-full bg-cyan-400 text-sm text-white px-[4px]">+1</div>:
                                                    <>
                                                    </>
                                                    }
                                                </div>
                                            </div>
                                            <div className="divider divide-solid px-3 h-[1px]"></div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-auto px-1 py-1 flex">
                        <button onClick={handleLogOut} className="bg-yellow-400 rounded-full flex p-2 self-center hover:bg-black hover:text-yellow-400">
                            <BiLogOut size={25} /> Logout
                        </button>
                    </div>
                </>
            )}
        </div>

    );
};

export default Sidebar;
