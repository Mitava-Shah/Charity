// In your backend code
import express from "express";
import { Donation } from "../models/Donation.js";
import { Donor } from "../models/Donor.js";

const router = express.Router();

router.post('/donation', async (req, res) => {
    try {
        const { email, contactno, addresstocollect, area,donationtype, condition, amount, username, quantity, timeofcooking, message } = req.body;

        // Create a new donation
        const donation = new Donation({
            email,
            contactno,
            addresstocollect,
            area,
            donationtype,
            condition,
            amount,
            username,
            quantity,
            timeofcooking,
            message,
        });

        // Save the donation to the database
        const result = await donation.save();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { agentusername, Status } = req.body;
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            { $set: { agentusername, Status } },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.json(donation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});



export { router as DonationRouter };
