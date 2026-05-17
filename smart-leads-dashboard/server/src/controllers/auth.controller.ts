import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { signToken } from '../utils/jwt.utils';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', data: errors.array() });
      return;
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email already in use' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash, role: 'sales_user' });

    const token = signToken(user._id.toString(), user.role);

    const { passwordHash: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      success: true,
      data: { token, user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', data: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = signToken(user._id.toString(), user.role);

    const { passwordHash: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      data: { token, user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

// ─── SIMPLE RESET PASSWORD (no token/email) ──────────────────────────────────
export const simpleResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Email and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'No account found with that email address' });
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: user._id }, { $set: { passwordHash: newPasswordHash } });

    res.status(200).json({ success: true, message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};
