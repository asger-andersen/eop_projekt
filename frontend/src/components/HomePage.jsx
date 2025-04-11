import React from 'react';
import { Toaster, toast } from 'sonner'
import { FiLogIn } from "react-icons/fi";
import LoginScreen from './loginScreen'
import DashboardFront from './DashboardFront'

const HomePage = ({ givenData }) => {
    const [user, setUser] = React.useState(null);

    const baseUrl = process.env.REACT_APP_BASE_URL

    // On page load, check if user is logged in
    React.useEffect(() => {
        checkCurrentUser();
    }, []);

    // Function for verifying user session
    const checkCurrentUser = async () => {
        // Make API call to backend to verify user session
        const verifySession = await fetch(`${baseUrl}/api/user/verify-session`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        const sessionResponse = await verifySession.json()
        console.log(sessionResponse)

        // Store user info in state if status is 200
        if (verifySession.status === 200) {
            console.log(sessionResponse)
            setUser(sessionResponse)
        } else {
            setUser(null)
        }
    };


    return (
        <section className='w-full h-full'>
            {
                !user ?
                    <DashboardFront user={user} />
                    : <LoginScreen setUser={setUser} />
            }
        </section>
    );
};

export default HomePage;