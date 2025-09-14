"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const generateToken_1 = require("../utils/generateToken");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        // Find user within the current tenant and populate tenantId
        const user = await User_1.User.findOne({
            email: email.toLowerCase(),
            tenantId: req.tenant._id
        }).populate('tenantId');
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Type cast the populated tenantId to ITenant
        const populatedTenant = user.tenantId;
        const token = (0, generateToken_1.generateToken)({
            userId: user._id,
            tenantId: populatedTenant._id,
            role: user.role
        });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                tenant: {
                    id: populatedTenant._id,
                    name: populatedTenant.name,
                    plan: populatedTenant.plan,
                    slug: populatedTenant.slug
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.login = login;
