"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notesController_1 = require("../controllers/notesController");
const tenantMiddleware_1 = require("../middleware/tenantMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply middleware to all routes
router.use(tenantMiddleware_1.tenantMiddleware);
router.use(authMiddleware_1.authMiddleware);
router.post('/', notesController_1.createNote);
router.get('/', notesController_1.getNotes);
router.get('/:id', notesController_1.getNote);
router.put('/:id', notesController_1.updateNote);
router.delete('/:id', notesController_1.deleteNote);
exports.default = router;
