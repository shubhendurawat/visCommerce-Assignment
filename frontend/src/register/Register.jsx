import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    
    const navigate = useNavigate();
    const {setAuthUser} = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({})


    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        if(inputData.password !== inputData.confpassword.toLowerCase()) {
            setLoading(false);
            return toast.error("Password does not match");
        } 
        try {
            const register = await axios.post('/api/v1/auth/register', inputData);
            const data = register.data;
            if(data.success === false) {
                setLoading(false);
                toast.error(data.message);
                console.log(data.message);
            }
            toast.success(data?.message);
            console.log(data.message)
            localStorage.setItem('visCommerce.chat', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/login')
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }


    const handleInput = (e) => {
        setInputData({
            ...inputData,
            [e.target.id]: e.target.value
        })
    }

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev,
            gender: selectGender === inputData.gender ? '' : selectGender
        }))
    }

    
    return (
        <>
            <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
                <div className="w-full p-6 rounded-lg border border-white">
                    <h1 className="text-3xl text-center text-gray-50">Register to <span className="text-3xl font-bold text-center text-yellow-400">visCommerce.Chat</span></h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-4 text-black">
                        <div>
                            <label className="text-gray-50">Fullname: </label>
                            <br />
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="fullName" type="text" onChange={handleInput} placeholder="Enter your fullname" required />
                        </div>
                        <div>
                            <label className="text-gray-50">Username: </label>
                            <br />
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="username" type="text" onChange={handleInput} placeholder="Enter your username" required />
                        </div>
                        <div>
                            <label className="text-gray-50">Email: </label>
                            <br />
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="email" type="email" onChange={handleInput} placeholder="Enter your email" required />
                        </div>
                        <div>
                            <label className="text-gray-50">Password: </label>
                            <br />
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="password" type="password" onChange={handleInput} placeholder="Enter your password" required />
                        </div>
                        <div>
                            <label className="text-gray-50">Confirm Password: </label>
                            <br />
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2" id="confpassword" type="text" onChange={handleInput} placeholder="Enter confirmed password" required />
                        </div>
                        <div id="gender" className="flex gap-1">
                            <label className="cursor-pointer label flex gap-2">
                                <span className="label-text font-semibold text-gray-50">Male:</span>
                                <input checked={inputData.gender === 'male'} onChange={() => selectGender('male')} type="checkbox" className="checkbox checkbox-warning"></input>
                            </label>
                            <label className="cursor-pointer label flex gap-2">
                                <span className="label-text font-semibold text-gray-50">Female:</span>
                                <input checked={inputData.gender === 'female'} onChange={() => selectGender('female')} type="checkbox" className="checkbox checkbox-warning"></input>
                            </label>
                        </div>
                        <button className="text-center mt-6 self-center w-full p-2 bg-yellow-400 text-lg text-black rounded-lg hover:bg-black hover:text-yellow-400" type="submit">
                            {loading ? "loading.." : "Register"}
                        </button>
                    </form>
                    <div className="pt-6">
                        <p className="text-sm font-semibold text-gray-50">Have an account?  <Link to={'/login'}><span className="text-gray-50 font-bold underline cursor-pointer hover:text-yellow-400">Login</span></Link> </p>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Register;