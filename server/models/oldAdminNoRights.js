const mongoose = require('mongoose');

const OldAdminNoRightsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    company_name: { type: String, default: null },
    role: { type: String, default: 'app_admin' },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
    applicationName: { type: String },
    revoked_at: { type: Date, default: Date.now },
    originalUserId: { type: mongoose.Schema.Types.ObjectId },
    status: { type: Boolean, default: false },
    authType: { type: String, enum: ['local', 'ldap'], default: 'local' }
});

const OldAdminNoRights = mongoose.model('OldAdminNoRights', OldAdminNoRightsSchema);

module.exports = OldAdminNoRights; 