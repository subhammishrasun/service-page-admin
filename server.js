const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/service_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Define schemas and models
const serviceCardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    readMoreLink: String
});

const highlightedProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    readMoreLink: String
});

const clientTestimonialSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    testimonialText: { type: String, required: true },
    service: String
});

const ServiceCard = mongoose.model('ServiceCard', serviceCardSchema);
const HighlightedProduct = mongoose.model('HighlightedProduct', highlightedProductSchema);
const ClientTestimonial = mongoose.model('ClientTestimonial', clientTestimonialSchema);

// Routes
app.post('/api/service-cards', upload.single('image'), async (req, res) => {
    try {
        const serviceCard = new ServiceCard({
            name: req.body.name,
            description: req.body.description,
            image: req.file ? req.file.filename : '',
            readMoreLink: req.body.readMoreLink
        });
        await serviceCard.save();
        res.status(201).json({
            message: 'Service card created successfully!',
            serviceCard
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating service card.',
            error: error.message
        });
    }
});

app.post('/api/highlighted-products', upload.single('image'), async (req, res) => {
    try {
        const highlightedProduct = new HighlightedProduct({
            name: req.body.name,
            description: req.body.description,
            image: req.file ? req.file.filename : '',
            readMoreLink: req.body.readMoreLink
        });
        await highlightedProduct.save();
        res.status(201).json({
            message: 'Highlighted product created successfully!',
            highlightedProduct
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating highlighted product.',
            error: error.message
        });
    }
});

app.post('/api/client-testimonials', async (req, res) => {
    try {
        const clientTestimonial = new ClientTestimonial({
            clientName: req.body.clientName,
            testimonialText: req.body.testimonialText,
            service: req.body.service
        });
        await clientTestimonial.save();
        res.status(201).json({
            message: 'Client testimonial created successfully!',
            clientTestimonial
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating client testimonial.',
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
