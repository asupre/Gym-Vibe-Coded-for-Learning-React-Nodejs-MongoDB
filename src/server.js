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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

