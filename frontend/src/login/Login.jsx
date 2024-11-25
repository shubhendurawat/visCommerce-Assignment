import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {


    const navigate = useNavigate();
    const {setAuthUser} = useAuth();
    const [userInput, setUserInput] = useState();
    const [loading , setLoading] = useState(false);

    const handleInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]:e.target.value
        })
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const login = await axios.post(`/api/v1/auth/login`, userInput);
            const data = login.data;
            if(data.success === false) {
                setLoading(false);
                console.log(data.message);
            }
            toast.success(data.message)
            localStorage.setItem('visCommerce.chat', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/')
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
            <div className="w-full p-6 rounded-lg border border-white">
                <h1 className="text-3xl text-center text-gray-50">Login to <span className="text-3xl font-bold text-center text-yellow-400">visCommerce.Chat</span></h1>
                <form onSubmit={handleSubmit} className="flex flex-col pt-4 text-black">
                    <div>
                        <label className="text-gray-50">Email: </label>
                        <br />
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="email" type="email" onChange={handleInput} placeholder="Enter your email" required />
                    </div>
                    <br />
                    <div>
                        <label className="text-gray-50">Password: </label>
                        <br />
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="password" type="password" onChange={handleInput} placeholder="Enter your password" required />
                    </div>
                    <button className="text-center mt-9 self-center w-full p-2 bg-yellow-400 text-lg text-black rounded-lg hover:bg-black hover:text-yellow-400" type="submit">
                        {loading ? "loading.." : "login"}
                    </button>
                </form>
                <div className="pt-6">
                    <p className="text-sm font-semibold text-gray-50">Don't have an account ? <Link to={'/register'}><span className="text-gray-50 font-bold underline cursor-pointer hover:text-yellow-400">Register Now</span></Link> </p>
                </div>
            </div>
        </div>
    )
}

export default Login