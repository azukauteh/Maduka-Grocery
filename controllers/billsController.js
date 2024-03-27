import Bills from "../models/billsModel.js";

// Controller to fetch bills
export const getBillsController = async (req, res) => {
    try {
        // Fetch all bills from the database
        const bills = await Bills.find();
        res.send(bills); // Send the fetched bills as response
    } catch(error) {
        console.error("Error fetching bills:", error); // Log any errors
        res.status(500).send("Internal Server Error"); // Send a 500 Internal Server Error response
    }
}

// Controller to add a bill
export const addBillsController = async (req, res) => {
    try {
        // Create a new bill instance with request body data
        const newBill = new Bills(req.body);
        // Save the new bill to the database
        await newBill.save();
        res.send("Bill Created Successfully!"); // Send success message
    } catch(error) {
        console.error("Error adding bill:", error); // Log any errors
        res.status(500).send("Internal Server Error"); // Send a 500 Internal Server Error response
    }
}
