import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Force IPv4 to bypass local DNS resolution issues common with ISPs
dns.setDefaultResultOrder('ipv4first'); 



const app = express();
app.use(cors());
app.use(express.json());

// Change these lines in your server.js
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected: LongLong Gym Vault is Open"))
  .catch(err => {
    console.error("❌ Connection Error Detail:");
    console.error(err.message);
    console.log("💡 Tip: If you're still stuck, try the Local MongoDB URI in your .env");
  });

// --- PLAN SCHEMA ---
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  durationUnit: { type: String, default: 'month' } // day, week, month, year
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);

// User Schema - Matches your Gym Management System requirements
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'Silver' },
  status: { type: String, default: 'pending' }, 
  role: { type: String, default: 'user' }
}, { timestamps: true }); // Automatically track when members join

const User = mongoose.model('User', userSchema);

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: String },
  image: { type: String, default: 'https://via.placeholder.com/150' }, // New Field
  status: { type: String, default: 'available' }
}, { timestamps: true });

const Coach = mongoose.model('Coach', coachSchema);



// 1. REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Determine Role: If it's the specific admin email, make them admin
    // REPLACE 'admin@gmail.com' WITH YOUR CHOSEN ADMIN EMAIL
    const role = email === 'admin@gmail.com' ? 'admin' : 'member';

    const newUser = new User({ name, email, password, plan, role, status: 'pending' });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check Password (Simple comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Success! Send back the user info
    res.json({ 
      message: "Login successful", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        status: user.status,
        profileImage: user.profileImage
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get all users (Admin only)
app.get('/api/users', async (req, res) => {
  try {
    // This tells MongoDB: Find users where the role is NOT 'admin'
const users = await User.find({ role: { $ne: 'admin' } });
    // This sends the data as a clean JSON array
    res.status(200).json(users); 
  } catch (err) {
    console.error("Admin Fetch Error:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// Update user status
app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ message: `Status updated to ${status}`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// DELETE ROUTE - Add this in server.js above app.listen
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`🗑️ Deleted: ${deletedUser.name}`);
    res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// 2. Add Coach Route
app.post('/api/coaches', async (req, res) => {
  try {
    const newCoach = new Coach(req.body);
    await newCoach.save();
    res.json({ message: "Coach added successfully!", coach: newCoach });
  } catch (err) {
    res.status(500).json({ message: "Error adding coach" });
  }
});

// 3. Get All Coaches Route
app.get('/api/coaches', async (req, res) => {
  try {
    const coaches = await Coach.find({});
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coaches" });
  }
});

// DELETE COACH ROUTE
app.delete('/api/coaches/:id', async (req, res) => {
  try {
    const deletedCoach = await Coach.findByIdAndDelete(req.params.id);
    if (!deletedCoach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    console.log(`🗑️ Removed Coach: ${deletedCoach.name}`);
    res.status(200).json({ message: "Coach removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coach", error: err.message });
  }
});

// 1. Get All Plans (For Registration Page & Admin)
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plans" });
  }
});

// 2. Create Plan (For Admin)
app.post('/api/plans', async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    res.json(newPlan);
  } catch (err) {
    res.status(500).json({ message: "Error creating plan" });
  }
});

// 3. Delete Plan (For Admin)
app.delete('/api/plans/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting plan" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

