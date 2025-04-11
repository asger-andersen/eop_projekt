import React from 'react';
import { IoIosArrowForward } from "react-icons/io";


const Activities = ({ data }) => {

    const formatInitials = (name) => {
        if (!name) return "";

        const parts = name.trim().split(" ");
        const first = parts[0]?.[0] || "";
        const last = parts[parts.length - 1]?.[0] || "";

        return (first + last).toUpperCase();
    };

    return (
        <div id='totalSales' className='row-span-6 flex flex-col justify-between text-left gap-2'>
            <div className='flex justify-between'>
                <h2 className='font-bold text-lg text-left items-center align-middle'>
                    Aktiviteter
                </h2>
                <a href="#" className='font-normal text-xs text-mobilepay flex items-center'>
                    Se alle
                </a>
            </div>
            <table className='w-full h-auto text-left rounded-xl px-6 py-4 bg-white'>
                <tbody>
                    {data?.map((item, index) => (
                        <>
                            {index < 4 && (
                                <>
                                    {index !== 0 && (
                                        <tr>
                                            <td></td>
                                            <td colSpan="3">
                                                <hr className="border-t border-gray-300 w-full" />
                                            </td>
                                        </tr>
                                    )}
                                    <tr className='p-2 gap-3'>
                                        <td className='py-2.5 pl-3 pr-2 aspect-square'>
                                            <div className='bg-mobilepay/15 border border-mobilepay/30 p-2.5 rounded-full aspect-square flex justify-center items-center'>
                                                <p className='text-xl text-mobilepay font-semibold text-center'>
                                                    {
                                                        formatInitials(item.receiving_company.company_name)
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <p className="font-medium text-sm text-left">
                                                    {
                                                        item.receiving_company.company_name.length > 21 ?
                                                            (item.receiving_company.company_name.slice(0, 18), "...")
                                                            : item.receiving_company.company_name
                                                    }
                                                </p>
                                                <div className='flex flex-row gap-1'>
                                                    <p className="font-medium text-ss text-black/50 text-left">
                                                        Du sendte
                                                    </p>
                                                    <p className='font-thin text-black/50 text-ss'>
                                                        •
                                                    </p>
                                                    <p className="font-normal text-black/50 text-ss text-left">
                                                        {new Date(item?.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 pr-3 pl-1 font-medium text-sm text-right justify-center justify-items-end">
                                            <p className={`py-1 px-2 rounded-smm w-fit text-black bg-black/10`}>
                                                {
                                                    (item.transaction_amount / 100).toString().replace(".", ",")
                                                } eur
                                            </p>
                                        </td>
                                        <td className="py-2 pr-3 font-medium text-sm text-right justify-center justify-items-end text-black/50">
                                            <IoIosArrowForward />
                                        </td>
                                    </tr>
                                </>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Activities;