"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenantsController_1 = require("../controllers/tenantsController");
const tenantMiddleware_1 = require("../middleware/tenantMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post('/:slug/upgrade', tenantMiddleware_1.tenantMiddleware, authMiddleware_1.authMiddleware, (0, roleMiddleware_1.requireRole)(['admin']), tenantsController_1.upgradeTenant);
// ADD THIS NEW ROUTE:
router.post('/:slug/downgrade', tenantMiddleware_1.tenantMiddleware, authMiddleware_1.authMiddleware, (0, roleMiddleware_1.requireRole)(['admin']), tenantsController_1.downgradeTenant);
exports.default = router;
