import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});