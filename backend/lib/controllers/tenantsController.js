"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downgradeTenant = exports.upgradeTenant = void 0;
const Tenant_1 = require("../../src/models/Tenant");
const upgradeTenant = async (req, res) => {
    try {
        const { slug } = req.params;
        if (req.tenant.slug !== slug) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
        const tenant = await Tenant_1.Tenant.findOneAndUpdate({ slug }, { plan: 'pro', noteLimit: -1 }, { new: true });
        if (!tenant) {
            res.status(404).json({ error: 'Tenant not found' });
            return;
        }
        res.json({
            message: 'Successfully upgraded to Pro plan',
            tenant: {
                id: tenant._id,
                name: tenant.name,
                plan: tenant.plan,
                noteLimit: tenant.noteLimit
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.upgradeTenant = upgradeTenant;
// ADD THIS DOWNGRADE FUNCTION:
const downgradeTenant = async (req, res) => {
    try {
        const { slug } = req.params;
        if (req.tenant.slug !== slug) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
        const tenant = await Tenant_1.Tenant.findOneAndUpdate({ slug }, { plan: 'free', noteLimit: 3 }, { new: true });
        if (!tenant) {
            res.status(404).json({ error: 'Tenant not found' });
            return;
        }
        res.json({
            message: 'Successfully downgraded to Free plan',
            tenant: {
                id: tenant._id,
                name: tenant.name,
                plan: tenant.plan,
                noteLimit: tenant.noteLimit
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.downgradeTenant = downgradeTenant;
