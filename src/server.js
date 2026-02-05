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



// Registration Endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already taken!" });
    }

    const newUser = new User({ 
      name, 
      email, 
      password, // Note: For your final thesis, consider hashing this with bcrypt!
      plan, 
      status: 'pending' 
    });

    await newUser.save();
    res.json({ message: "Registration successful! Please pay physically to activate." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    
    // 2. Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. If match, send back the user data (except password)
    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

