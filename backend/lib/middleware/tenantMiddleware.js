"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMiddleware = void 0;
const Tenant_1 = require("../models/Tenant");
const tenantMiddleware = async (req, res, next) => {
    try {
        const tenantSlug = req.headers['x-tenant-id'];
        if (!tenantSlug) {
            res.status(400).json({ error: 'Tenant ID is required in headers' });
            return;
        }
        const tenant = await Tenant_1.Tenant.findOne({ slug: tenantSlug });
        if (!tenant) {
            res.status(404).json({ error: 'Tenant not found' });
            return;
        }
        req.tenant = tenant;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.tenantMiddleware = tenantMiddleware;
