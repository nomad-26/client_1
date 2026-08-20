import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { memoryStore } from './memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_thread_and_style_2026';

const generateToken = (id, email, role, name) => {
  return jwt.sign({ id, email, role, name }, JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email });
    } catch {
      existingUser = memoryStore.users.find((u) => u.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser = null;
    try {
      newUser = await User.create({
        name,
        email,
        phone: phone || '',
        passwordHash,
        role: role || 'customer',
      });
    } catch {
      newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        passwordHash,
        role: role || 'customer',
        membership: 'Standard Member',
        avatar: '',
        measurements: { chest: '40.0"', waist: '34.0"', shoulder: '18.0"', sleeveLength: '25.0"' },
        createdAt: new Date().toISOString(),
      };
      memoryStore.users.push(newUser);
    }

    const token = generateToken(newUser._id || newUser.id, newUser.email, newUser.role, newUser.name);
    res.status(201).json({
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        membership: newUser.membership || 'Standard Member',
        avatar: newUser.avatar,
        measurements: newUser.measurements,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = null;
    try {
      user = await User.findOne({ email });
    } catch {
      user = memoryStore.users.find((u) => u.email === email);
    }

    if (!user && memoryStore.users.find((u) => u.email === email)) {
      user = memoryStore.users.find((u) => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id || user.id, user.email, user.role, user.name);

    res.json({
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+1 (555) 019-2834',
        role: user.role,
        membership: user.membership || 'Premium Member',
        avatar: user.avatar || '',
        measurements: user.measurements || { chest: '40.5"', waist: '34.0"', shoulder: '18.5"', sleeveLength: '25.0"' },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    let user = null;
    try {
      user = await User.findById(req.user.id);
    } catch {
      // DB unavailable — fall back to memory store
      user = memoryStore.users.find((u) => u.id === req.user.id || u.email === req.user.email);
    }

    // Also check memory store if DB returned nothing
    if (!user) {
      user = memoryStore.users.find((u) => u.email === req.user.email);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        membership: user.membership || 'Standard Member',
        avatar: user.avatar || '',
        measurements: user.measurements || {},
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
