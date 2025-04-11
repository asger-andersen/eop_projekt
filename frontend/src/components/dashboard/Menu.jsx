import React from 'react';
import { TbUpload } from "react-icons/tb";
import { TbDownload } from "react-icons/tb";
import { TbLineScan } from "react-icons/tb";
import { PiQrCode } from "react-icons/pi";


const Menu = () => {

    return (
        <div>
            <nav className='flex flex-row justify-evenly mx-3 px-2.5 py-3 rounded-full text-xs font-medium text-white bg-mobilepay'>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <TbUpload size={28} />
                    Anmod
                </a>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <TbDownload size={28} />
                    Anmod
                </a>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <TbLineScan size={28} />
                    Scan
                </a>
                <a href="#" className='flex flex-col justify-between text-center items-center'>
                    <PiQrCode size={28} />
                    Vis QR
                </a>
            </nav>
        </div>
    );
};

export default Menu;