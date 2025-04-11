import React from 'react';
import { Toaster, toast } from 'sonner'
import { FiLogIn } from "react-icons/fi";

const LoginScreen = ({ setUser }) => {

    const [loginInfo, setLoginInfo] = React.useState({ phone: "", password: "" });

    const baseUrl = process.env.REACT_APP_BASE_URL

    // Function for logging in
    const signIn = async () => {
        console.log(loginInfo)

        const signingIn = await fetch(`${baseUrl}/api/user/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_phone: loginInfo.phone,
                user_password: loginInfo.password
            }),
            credentials: 'include',
        })
        const signinResponse = await signingIn.json()
        console.log(signinResponse.user)

        // Store user info in state if status is 200
        if (signingIn.status === 200) {
            console.log(signinResponse)
            setUser(signinResponse.user)
        } else {
            setUser(null)
            throw new Error()
        }
    }


    return (
        <div className='h-full w-full grid grid-rows-10'>
            <div className='row-span-4 flex flex-col bg-[#F5F5F2] justify-center items-center align-center gap-4'>
                <Toaster />
                <div className='flex flex-col gap-1'>
                </div>
            </div>
            <div className='row-span-6 bg-[#F5F5F2] shadow-t-xl rounded-3xl flex w-full h-fit'>
                <div className='mx-16 my-20 w-full h-fit'>
                    <h1 className='font-black text-3xl text-left'>
                        Log ind
                    </h1>
                    <form
                        className='w-full flex flex-col gap-10 pt-10'
                        action="submit"
                        onSubmit={(e) => {
                            e.preventDefault();
                            toast.promise(signIn, {
                                loading: 'Signing in...',
                                success: 'Successfully signed in!',
                                error: 'Credentials do not match....',
                            });
                        }}
                    >
                        <div id='inputs' className='flex flex-col gap-2'>
                            <div className='flex flex-col text-left'>
                                <label
                                    htmlFor=""
                                    className='text-xs mb-0.5'>
                                    Mobilnummer
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder='+45 12 34 56 78'
                                    required
                                    className='border-black border px-5 py-3 rounded-lg text-sm font-light'
                                    onChange={(e) => {
                                        setLoginInfo({ ...loginInfo, phone: (e.target.value).replaceAll(" ", "") });
                                    }}
                                />
                            </div>
                            <div className='flex flex-col text-left'>
                                <label
                                    htmlFor=""
                                    className='text-xs mb-0.5'>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder='kodeord123'
                                    required
                                    className='border-black border px-5 py-3 rounded-lg text-sm font-light'
                                    onChange={(e) => {
                                        setLoginInfo({ ...loginInfo, password: e.target.value });
                                    }}
                                />
                            </div>
                        </div>
                        <div className='w-full'>
                            <button
                                type="submit"
                                className='border-black px-5 py-3 rounded-lg text-sm font-medium w-full bg-mobilepay text-white align-center justify-center'>
                                <div className='flex flex-row gap-5 items-center justify-center'>
                                    <FiLogIn /> Log ind
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;