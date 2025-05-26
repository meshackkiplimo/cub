import { eq } from "drizzle-orm";
import db from "./drizzle/db";
import { CustomerTable } from "./drizzle/schema";

const getAllCustomers = async () => {
    return await db.query.CustomerTable.findMany()
}
const getById = async (customer_id: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customer_id, customer_id) 
    })

}

const getCustomerWithReservations = async (customer_id: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customer_id, customer_id),
        with: {
            reservations: true // Assuming you have a relation defined in your schema
        }
    });
}



async function main() {
    const customers = await getAllCustomers();

    
    const customer = await getById(2);
    if(!customer) {
        
        return;
    }

    const reserved = await getCustomerWithReservations(customer.customer_id);
    if (!reserved) {
        console.log("No reservations found for this customer.");
        return;
    }
    console.log("Customer Details:", customer);
    console.log("Reservations:", reserved.reservations);
    
}

main().catch((error) => {
    console.error("Error fetching customers:", error);
    process.exit(1); // Exit with an error code
});
