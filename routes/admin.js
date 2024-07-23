import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { Admin } from "../models/Admin.js";
import { Donation } from "../models/Donation.js";
import {Donor} from "../models/Donor.js"
import jwt from 'jsonwebtoken';

router.post('/adminsignup', async (req, res) => {
    const { email, password } = req.body;
    try{
    const admin = await Admin.findOne({ email });
    if (admin) {
        return res.json({ message: 'Admin already exists' });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
        email, password: hashpassword
    });
    res.json({status:"true", message: "Record registered",admin:newAdmin });
}catch(error){
    console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
}
});

router.post('/adminlogin', async (req, res) => {
   try {const { email, password } = req.body;
console.log("hello")
    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(401).json({ error: "Admin is not registered" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
        return res.status(401).json({ error: "Password is incorrect" });
    }
    const Admintoken = jwt.sign({ email: admin.email }, process.env.KEY, { expiresIn: '1h' });
    res.json({Admintoken});

}catch(error){
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
}
   
});

router.get('/pandingdonations', async (req, res) => {
    try {
        const donations = await Donation.find().exec();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/delivereddonations', async (req, res) => {
    try {
        const deliveredCollections = await Donation.find({ Status: 'Delivered' });
        res.status(200).json(deliveredCollections);
    } catch (error) {
        console.error('Error fetching delivered collections:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.get('/countadmin', async (req, res) => {
    try {
      const count = await Admin.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/pending', async (req, res) => {
    try {
        const {username } = req.query;
        const count = await Donation.countDocuments({ Status: 'Pending' });
        const  donordonations = await Donation.countDocuments({Status:'Pending', username})

        res.json({ count,donordonations });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/accepted', async (req, res) => {
    try {
        const count = await Donation.countDocuments({ Status: 'Accepted' });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/assigned', async (req, res) => {
    try {
        const { agentusername,username } = req.query;
        const  agentdonations = await Donation.countDocuments({Status:'Agent assigned', agentusername})     
        const  donordonations = await Donation.countDocuments({Status:'Agent assigned', username})
        const count = await Donation.countDocuments({ Status:'Agent assigned' });
        res.json({ count,agentdonations,donordonations });
      
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/collected', async (req, res) => {
    try {
        const { agentusername,username } = req.query;
        const count = await Donation.countDocuments({ Status: 'Collected' });
        const  agentdonations = await Donation.countDocuments({Status:'Collected', agentusername})
        const  donordonations = await Donation.countDocuments({Status:'Collected', username})

        res.json({ count,agentdonations ,donordonations});
      
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/delivered', async (req, res) => {
    try {
        const { agentusername,username } = req.query;
        const count = await Donation.countDocuments({ Status: 'Delivered' });
        const agentdonations = await Donation.countDocuments({Status:'Delivered', agentusername})
        const  donordonations = await Donation.countDocuments({Status:'Delivered', username})

        res.json({ count,agentdonations ,donordonations});
       
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/accept/:id', async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.Status = 'Accepted';
        await donation.save();

        res.status(200).json({ message: 'Status updated to Accepted' });
    } catch (error) {
        console.error('Error updating status to Accepted:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/reject/:id', async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.Status = 'Rejected';
        await donation.save();

        res.status(200).json({ message: 'Status updated to Accepted' });
    } catch (error) {
        console.error('Error updating status to Accepted:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Donation.findByIdAndDelete(id);
        res.status(200).send({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/donordetail', async (req, res) => {
    try {
      const donors = await Donor.find();
      res.json(donors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.get('/donor', async (req, res) => {
    const { username } = req.query;

    try {
        const donors = await Donor.findOne({username}).exec();
        res.status(200).json(donors);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch donation records' });
    }
});

export { router as AdminRouter };


