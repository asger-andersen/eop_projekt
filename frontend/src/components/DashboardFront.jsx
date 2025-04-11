import React from 'react';

import Navigation from './dashboard/Navigation'
import Menu from './dashboard/Menu'
import Activities from './dashboard/Activities'
import Swipe from './dashboard/Swipe'

const DashboardFront = ({ user }) => {

    const [userData, setUserData] = React.useState()
    const [showSwipe, setShowSwipe] = React.useState(false)

    const baseUrl = process.env.REACT_APP_BASE_URL

    // On page load, fetch user data - When transaction is completed or closed, fetch updated data
    React.useEffect(() => {
        fetchUserData();
    }, [showSwipe]);


    // Function for fetching user data
    const fetchUserData = async () => {
        // Make API call to backend to fetch user data
        const userData = await fetch(`${baseUrl}/api/user/getdata`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        const dataResponse = await userData.json()

        // Store user data in state if status is 200
        if (userData.status === 200) {
            console.log(dataResponse)
            setUserData(dataResponse)
            if (dataResponse.find(({ state }) => state === "pending")) {
                console.log("User has pending transactions")
                setShowSwipe(true)
            }
        } else {
            setUserData(null)
        }
    };


    return (
        <>
            {showSwipe &&
                <div className='z-10 absolute h-screen w-full flex flex-col justify-end bg-black'>
                    <Swipe setShowSwipe={setShowSwipe} pendingTransaction={userData.find(({ state }) => state === "pending")} />
                </div>
            }
            <div id='dashboard' className='mx-5 pt-14 pb-8 h-full vw-100 flex flex-col justify-between'>
                <div>
                    <Activities user={user} data={userData?.filter(({ state }) => state === "completed")} />
                </div>
                <div className='mx-2 flex flex-col gap-7'>
                    <Menu />
                    <Navigation />
                </div>
            </div>
        </>
    );
};

export default DashboardFront;