import React from 'react';
import { Toaster, toast } from 'sonner'
import { HiMiniHome } from "react-icons/hi2";
import { FaClock } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";

const Navigation = ({ salesData }) => {

    return (
        <div>
            <nav className='flex flex-row justify-between mx-2 text-xxxs text-mp-black/50 font-medium'>
                <a href="#" className='flex flex-col justify-between text-center items-center text-mp-black'>
                    <HiMiniHome size={30} />
                    Hjem
                </a>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <FaClock size={23} />
                    Aktiviteter
                </a>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <HiMiniUserGroup size={30} />
                    Grupper
                </a>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <FaUser size={23} />
                    Mig
                </a>
            </nav>
        </div>
    );
};

export default Navigation;