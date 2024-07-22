import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

import { AgentRouter } from './routes/agent.js';
import { DonorRouter } from './routes/donor.js';
import { AdminRouter } from './routes/admin.js';
import { DonationRouter } from './routes/donation.js';
import { ImageRouter } from './routes/image.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["*"]
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/agent', AgentRouter);
app.use('/donor', DonorRouter);
app.use('/admin', AdminRouter);
app.use('/donate', DonationRouter);
app.use('/images', ImageRouter);

// Serve static files from the React app
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
