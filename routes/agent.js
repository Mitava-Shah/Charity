import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { Agent } from "../models/Agent.js";
import jwt from 'jsonwebtoken';
import { Donation } from '../models/Donation.js'

router.post('/agentsignup', async (req, res) => {
  const { firstName, lastName, email, username, area, contactNo, address, city, pincode, password } = req.body;
  try {
    const agent = await Agent.findOne({ email });
    if (agent) {
      return res.json({ message: 'Agent already exists' });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newAgent = await Agent.create({
      firstName, lastName, contactNo, email, username, address, area, city, pincode, password: hashpassword
    });
    res.json({ status: "true", message: "Record registered", agent: newAgent });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/agentlogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const agent = await Agent.findOne({ username });
    if (!agent) {
      return res.status(401).json({ error: "Agent is not registered" });
    }
    const validPassword = await bcrypt.compare(password, agent.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Password is incorrect" });
    }
    const Agenttoken = jwt.sign({ email: agent.email }, process.env.KEY, { expiresIn: '1h' });
    res.json({ Agenttoken });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }

});

router.get('/agentdetail', async (req, res) => {
  try {
    const agents = await Agent.find().exec();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/countagent', async (req, res) => {
  try {
    const count = await Agent.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/pandingcollection', async (req, res) => {
  try {
    const { agentusername } = req.query;
    const donations = await Donation.find({ agentusername }).exec();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/deliveredcollections', async (req, res) => {
  try {
    const { agentusername } = req.query;
    const donations = await Donation.find({ agentusername, Status: 'Delivered' }).exec();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update status to "Collected"
router.put('/collect/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.Status = 'Collected';
    await donation.save();

    res.status(200).json({ message: 'Status updated to Collected' });
  } catch (error) {
    console.error('Error updating status to Collected:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update status to "Delivered"
router.put('/deliver/:id', async (req, res) => {
  try {
    const { addresstodonate, Status } = req.body
    const donation = await Donation.findByIdAndUpdate(req.params.id,
      { $set: { addresstodonate, Status } },
      { new: true });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(200).json({ message: 'Status updated to Delivered' });
  } catch (error) {
    console.error('Error updating status to Delivered:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/deliveredcollections', async (req, res) => {
//     try {
//         const deliveredCollections = await Donation.find({ Status: 'Delivered' });
//         res.status(200).json(deliveredCollections);
//     } catch (error) {
//         console.error('Error fetching delivered collections:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

router.get('/agents', async (req, res) => {
  try {
    const { username } = req.query;
    const donations = await Agent.find({ username }).exec();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

  Agent.findByIdAndUpdate(req.params.id, updatedFields, { new: true })
    .then(updatedAgent => {
      res.json(updatedAgent);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const agent = await Agent.findOne({ username });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { router as AgentRouter };
