import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { Donor } from "../models/Donor.js";
import { Donation } from "../models/Donation.js"
import jwt from 'jsonwebtoken';
import {Agent} from '../models/Agent.js'

router.post('/donorsignup', async (req, res) => {
  const { firstName, lastName, email, username,contactNo, address, city, pincode, password } = req.body;
  try {
    const donor = await Donor.findOne({ username });
    if (donor) {
      return res.json({ message: 'donor already exists' });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newDonor = await Donor.create({
      firstName, lastName, contactNo, email,username, address, city, pincode, password: hashpassword
    });
    res.json({ status: "true", message: "Record registered", donor: newDonor });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/donorlogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const donor = await Donor.findOne({ username });
    if (!donor) {
      return res.status(401).json({ error: "Donor is not registered" });
    }
    const validPassword = await bcrypt.compare(password, donor.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Password is incorrect" });
    }
    const Donortoken = jwt.sign({ email: donor.email }, process.env.KEY, { expiresIn: '1h' });
    res.json({ Donortoken });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }

});

router.get('/pandingdonations', async (req, res) => {
  try {
    const { username } = req.query;
    const donations = await Donation.find({ username }).exec();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/donors', async (req, res) => {
  try {
    const { username } = req.query;
    const donations = await Donor.find({ username }).exec();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/delivereddonations', async (req, res) => {
  try {
    const { username } = req.query;
    const donations = await Donation.find({ username, Status: 'Delivered' }).exec();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/countdonor', async (req, res) => {
  try {
    const count = await Donor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const donor = await Donor.findOne({ email });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', (req, res) => {
  const { firstName, lastName, contactNo, address, city, pincode } = req.body;
  
  // Create an object to store the fields that need to be updated
  const updatedFields = {};
  
  // Check if each field in req.body is not blank, and if not, add it to updatedFields
  if (firstName) {
    updatedFields.firstName = firstName;
  }
  if (lastName) {
    updatedFields.lastName = lastName;
  }
  if (contactNo) {
    updatedFields.contactNo = contactNo;
  }
  if (address) {
    updatedFields.address = address;
  }
  if (city) {
    updatedFields.city = city;
  }
  if (pincode) {
    updatedFields.pincode = pincode;
  }
  
  // Check if there are any fields to update
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  
  Donor.findByIdAndUpdate(req.params.id, updatedFields, { new: true })
    .then(updatedDonor => {
      res.json(updatedDonor);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


export { router as DonorRouter };

