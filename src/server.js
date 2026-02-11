import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Force IPv4 to bypass local DNS resolution issues common with ISPs
dns.setDefaultResultOrder('ipv4first'); 

const app = express();

// --- MIDDLEWARE FIX ---
// We need to set the limit to 10mb for images. 
// (Removed the duplicate app.use(express.json()) that was causing conflicts)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected: LongLong Gym Vault is Open"))
  .catch(err => {
    console.error("❌ Connection Error Detail:", err.message);
  });


  // --- EXERCISE SCHEMA ---
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true }, // e.g., Chest, Legs, Back
  equipment: { type: String, default: 'None' },
  difficulty: { type: String, default: 'Beginner' },
  instructions: { type: String },
  image: { type: String, default: '' } // Base64 for GIFs or Photos
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);

// --- PLAN SCHEMA ---
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  durationUnit: { type: String, default: 'month' }
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);

// --- USER SCHEMA (FIXED) ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'Silver' },
  status: { type: String, default: 'pending' }, 
  role: { type: String, default: 'user' },
  // 👇 THIS WAS MISSING! Adding this allows the image to be saved.
  profileImage: { type: String, default: '' },
  paymentTicket: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: String },
  image: { type: String, default: 'https://via.placeholder.com/150' },
  status: { type: String, default: 'available' }
}, { timestamps: true });

const Coach = mongoose.model('Coach', coachSchema);

// --- PRODUCT SCHEMA ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Supplement' }, // e.g., Protein, Gear, Drinks
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' } // Base64 string
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// --- ROUTES ---

// UPDATE USER PROFILE PICTURE
app.patch('/api/users/:id/profile', async (req, res) => {
  try {
    const { profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { profileImage: profileImage }, 
      { new: true }
    );
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists!" });

    // REPLACE 'admin@gmail.com' WITH YOUR ADMIN EMAIL
    const role = email === 'admin@gmail.com' ? 'admin' : 'member';

    const newUser = new User({ name, email, password, plan, role, status: 'pending' });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) return res.status(400).json({ message: "Invalid password" });

    res.json({ 
      message: "Login successful", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        status: user.status,
        profileImage: user.profileImage // Send image to frontend
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET ALL USERS (ADMIN)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json(users); 
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// UPDATE STATUS
app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Status updated to ${status}`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// DELETE USER
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// COACH ROUTES
app.post('/api/coaches', async (req, res) => {
  try {
    const newCoach = new Coach(req.body);
    await newCoach.save();
    res.json({ message: "Coach added", coach: newCoach });
  } catch (err) { res.status(500).json({ message: "Error adding coach" }); }
});

app.get('/api/coaches', async (req, res) => {
  try {
    const coaches = await Coach.find({});
    res.json(coaches);
  } catch (err) { res.status(500).json({ message: "Error fetching coaches" }); }
});

app.delete('/api/coaches/:id', async (req, res) => {
  try {
    await Coach.findByIdAndDelete(req.params.id);
    res.json({ message: "Coach removed" });
  } catch (err) { res.status(500).json({ message: "Error deleting coach" }); }
});

// PLAN ROUTES
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (err) { res.status(500).json({ message: "Error fetching plans" }); }
});

app.post('/api/plans', async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    res.json(newPlan);
  } catch (err) { res.status(500).json({ message: "Error creating plan" }); }
});

app.delete('/api/plans/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (err) { res.status(500).json({ message: "Error deleting plan" }); }
});

// 1. Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// 2. Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// 3. Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

app.patch('/api/users/:id/ticket', async (req, res) => {
  try {
    const { paymentTicket } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { paymentTicket: paymentTicket }, 
      { new: true }
    );
    res.json({ message: "Ticket uploaded", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error uploading ticket" });
  }
});

// 1. Get all exercises
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: "Error fetching exercises" });
  }
});

// 2. Add a new exercise (Admin)
app.post('/api/exercises', async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.json(newExercise);
  } catch (err) {
    res.status(500).json({ message: "Error adding exercise" });
  }
});

// 3. Delete an exercise (Admin)
app.delete('/api/exercises/:id', async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercise removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting exercise" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});