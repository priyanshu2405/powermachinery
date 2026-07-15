const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const SettingSchema = new mongoose.Schema({
    setting_key: { type: String, required: true, unique: true },
    setting_value: { type: String }
});

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String },
    bio: { type: String },
    imageUrl: { type: String },
    display_order: { type: Number, default: 0 }
});

const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    display_order: { type: Number, default: 0 }
});

const CaseStudySchema = new mongoose.Schema({
    client: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    display_order: { type: Number, default: 0 }
});

const PartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    display_order: { type: Number, default: 0 }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Setting: mongoose.model('Setting', SettingSchema),
    TeamMember: mongoose.model('TeamMember', TeamMemberSchema),
    Equipment: mongoose.model('Equipment', EquipmentSchema),
    CaseStudy: mongoose.model('CaseStudy', CaseStudySchema),
    Partner: mongoose.model('Partner', PartnerSchema)
};
