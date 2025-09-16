"use server"

import { createClient } from "../../../../../utils/supabase/server"
import NewInvoice from "../../../../../components/Invoices/NewInvoice";

const page = async ({ params }) => {

    const supabase = await createClient();

    const { data: client, error } = await supabase.from('clients').select('*').eq('id', params.id).single();

    if (error) {
        return(
            <div className="text-center py-20 flex flex-col justify-center items-center  rounded-lg">
                <h2 className=" font-guthenBloots text-5xl font-thin mb-2">No Client Found!</h2>
                <p className="text-muted-foreground text-pretty max-w-[500px]">
                    The client you are looking for does not exist.
                </p>
            </div>
        )
    }


    return (
        <NewInvoice client={client} />
    )
}

export default page