"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const generateToken_1 = require("../utils/generateToken");
const User_1 = require("../models/User");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const decoded = (0, generateToken_1.verifyToken)(token);
        const user = await User_1.User.findById(decoded.userId).populate('tenantId');
        if (!user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        // Ensure user belongs to the current tenant
        if (req.tenant && user.tenantId._id.toString() !== req.tenant._id.toString()) {
            res.status(403).json({ error: 'Access denied to this tenant' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
