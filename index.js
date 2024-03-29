import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const app = express();

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dvyzdaktj',
    api_key: '287193912617465',
    api_secret: 'KfgXApsA-q21iq7gBlvTl_5Vb3A'
});

// Multer configuration (remove the 'dest' option to prevent saving to a local folder)
const upload = multer();
app.get("/", (req, res) => {
    res.send("hello world")
})
// Define a route for handling image uploads
app.post("/upload", upload.single('image'), async (req, res) => {
    try {
        // Check if the request contains file data
        if (!req.file) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        // Convert buffer to data URL
        const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload the file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
            upload_preset: 'ml_default' // Specify your Cloudinary upload preset
        });

        // Send back the URL of the uploaded image
        res.json(uploadResponse.secure_url);
    } catch (error) {
        console.error("Error uploading image:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const Port = process.env.PORT || 9000;
app.listen(Port, () => {
    console.log("Server is running on port " + Port);
});
