// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// --- ROUTES ---

// 1. REGISTER
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  
  if(!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, password, role: role || 'user' });
    await newUser.save();
    console.log(`✅ New User Registered: ${email} (${role})`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. STRICT LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🔐 Attempting login for: ${email}`);

  try {
    const user = await User.findOne({ email });
    
    // Check 1: Does user exist?
    if (!user) {
        console.log("❌ User not found in DB");
        return res.status(404).json({ message: "User not found. Please Register first." });
    }

    // Check 2: Does password match?
    if (user.password !== password) {
        console.log("❌ Wrong Password");
        return res.status(400).json({ message: "Invalid Password!" });
    }

    console.log("✅ Login Successful");
    res.json({ message: "Login successful", role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));