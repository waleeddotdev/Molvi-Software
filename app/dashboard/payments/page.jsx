import AddPayment from '../../../components/Payments/AddPayment'
import AllPayments from '../../../components/Payments/AllPayments'


const page = () => {
    return (
        <div className='space-y-4 md:space-y-8 '>
            <div className="flex flex-row gap-1 items-center justify-between">
                <h1 className='font-recoleta text-pretty text-2xl font-extrabold leading-[105%]'>Payments</h1>
                <AddPayment />
            </div>
            <div className='grid grid-cols-1 gap-5'>
                <AllPayments />
            </div>
        </div>
    )
}

export default page
