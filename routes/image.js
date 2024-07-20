import express from "express";
import multer from 'multer'
const router = express.Router();
import { Image } from "../models/Image.js";
import path from 'path'

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {

        const fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        console.log(fileName);
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  });
  
  // Get all images
  router.get('/', async (req, res) => {
    try {
      const images = await Image.find();
      res.json(images);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Add a new image
  router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Save the image path and description to the database
        const imagePath = req.file.filename;
        const description = req.body.description || 'No description provided';

        const newImage = new Image({ path: imagePath, description });
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', imagePath, description });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  
  // Delete an image
  router.delete('/:id', async (req, res) => {
    try {
      await Image.findByIdAndDelete(req.params.id);
      res.json({ message: 'Image deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  
  router.get('/download/:filename', (req, res) => {
      const { filename } = req.params;
      const filePath = join(__dirname, '../uploads', filename);
  
      res.download(filePath, (err) => {
          if (err) {
              console.error(err);
              res.status(500).json({ message: 'File download failed' });
          }
      });
  });
  
  router.get('/image', async (req, res) => {
    try {
        // Query the database for the last 6 images
        const images = await Image.find().sort({ _id: -1 }).limit(6);

        // Respond with the images
        res.json(images);
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
export { router as ImageRouter };