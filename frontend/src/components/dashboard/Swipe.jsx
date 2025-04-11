import React from 'react';
import { Toaster, toast } from 'sonner'
import ClipLoader from "react-spinners/ClipLoader";

const Swipe = ({ setShowSwipe, pendingTransaction }) => {
    const [sendAmount, setSendAmount] = React.useState();
    const [loading, setLoading] = React.useState(false);

    const baseUrl = process.env.REACT_APP_BASE_URL

    // Function for formatting initials used in profile picture
    const formatInitials = (name) => {
        if (!name) return "";

        const parts = name.trim().split(" ");
        const first = parts[0]?.[0] || "";
        const last = parts[parts.length - 1]?.[0] || "";

        return (first + last).toUpperCase();
    };

    // Complete the transaction
    const completeTransaction = async () => {
        // Verify that a reciever copany is present, and that input is not below 0.1
        if (!pendingTransaction.receiving_company || sendAmount < 0.1) {
            return
        }

        // Make API call
        const initiateTransaction = await fetch(`${baseUrl}/api/transaction/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to_company: pendingTransaction.receiving_company.company_id,
                order_id: pendingTransaction.order_id,
                transaction_amount: pendingTransaction.transaction_amount,
                transaction_currency: pendingTransaction.transaction_currency.iso_code,
                transaction_id: pendingTransaction.transaction_id
            }),
            credentials: 'include',
        })
        //const response = await initiateTransaction.json()

        // Success if status is 201
        if (initiateTransaction.status === 201) {
            setLoading(false)
            setShowSwipe(false)
            toast.success("Transaktion gennemført!")
        } else {
            toast.error("Transaktion Fejlede, prøv venligst igen")
            setLoading(false)
        }
    }


    // Cancel the transaction
    const cancelTransaction = async () => {
        // Make API call
        const cancelPendingTransaction = await fetch(`${baseUrl}/api/transaction/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transaction_id: pendingTransaction.transaction_id
            }),
            credentials: 'include',
        })
        //const response = await initiateTransaction.json()

        // Success if status is 204
        if (cancelPendingTransaction.status === 204) {
            setLoading(false)
            setShowSwipe(false)
            toast.success("Transaktion annulleret!")
        } else {
            toast.error("Annnullering fejlede")
        }
    }

    return (
        <>
            <Toaster />
            <div id='send_to' className='w-full h-[95vh] bg-mp-grey rounded-xl p-5 flex flex-col justify-between'>
                <div className='flex flex-col gap-36'>
                    <div>
                        <div>
                            <div className='grid grid-flow-col grid-cols-3 mb-4'>
                                <button
                                    className='col-span-1 text-left font-normal text-sm'
                                    onClick={(e) => {
                                        console.log("Button clicked")
                                        cancelTransaction()
                                    }}>
                                    Annuller
                                </button>
                                <p className='col-span-1 font-semibold text-sm'>
                                    Send til
                                </p>
                                <p className='col-span-1'>

                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-center gap-2'>
                                <div className='bg-mobilepay/15 border border-mobilepay/30 p-1 rounded-full aspect-square'>
                                    <p className='text-xxs text-mobilepay font-semibold text-center'>
                                        {
                                            formatInitials(pendingTransaction?.receiving_company?.company_name)
                                        }
                                    </p>
                                </div>
                                <p className='flex font-medium text-sm items-center'>
                                    {pendingTransaction?.receiving_company.company_name}
                                </p>
                            </div>
                            <p className='font-light text-ss text-black/50'>
                                #{pendingTransaction?.order_id} • {pendingTransaction?.receiving_company.company_website}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 justify-center'>
                        <p className='text-5xl font-extrabold flex justify-center items-center text-center'>
                            {(pendingTransaction?.transaction_amount / 100).toString().replace(".", ",")} {pendingTransaction?.transaction_currency.iso_code}
                        </p>
                        <p className='text-black/50'>
                            Ordre #{pendingTransaction?.order_id}
                        </p>
                    </div>
                </div>
                <div className='flex justify-center pb-7'>
                    <button
                        className='bg-mobilepay w-[17rem] h-[3.5rem] rounded-full text-white text-lg font-semibold flex flex-row justify-center items-center'
                        onClick={() => {
                            setLoading(true)
                            completeTransaction()
                        }}>
                        {
                            loading ?
                                <ClipLoader
                                    color="#ffffff"
                                    loading={loading}
                                    size={30}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                                : "Send"
                        }
                    </button>
                </div>
            </div>
        </>
    );
};

export default Swipe;