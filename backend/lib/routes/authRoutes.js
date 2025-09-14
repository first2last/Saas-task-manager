"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../authController");
const tenantMiddleware_1 = require("../../../src/middleware/tenantMiddleware");
const router = (0, express_1.Router)();
router.post('/login', tenantMiddleware_1.tenantMiddleware, authController_1.login);
exports.default = router;
