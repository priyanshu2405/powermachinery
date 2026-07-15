const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Setting, TeamMember, Equipment, CaseStudy, Partner } = require('./models');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mbcrushings';
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
        
        await seedDatabase();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    // Seed User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('admin123', salt);
        await User.create({ username: 'admin', password: hashedPassword });
        console.log('Default admin user created');
    }

    // Seed Settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
        const initialSettings = [
            { setting_key: 'company_name', setting_value: 'ABHIRISHI INFRA PRIVATE LIMITED' },
            { setting_key: 'phone', setting_value: '+91 88782 29637' },
            { setting_key: 'email', setting_value: 'info@abhirishiinfra.com' },
            { setting_key: 'address', setting_value: 'House No 1783, Baliya Kheda, Omaxe City 1, Indore, Madhya Pradesh' }
        ];
        await Setting.insertMany(initialSettings);
    }

    // Seed Team Members
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
        const initialTeam = [
            { name: 'Mr. Rishi Kumar', role: 'Director', bio: 'With decades of visionary leadership in the infrastructure and construction sector, Mr. Kumar guides the strategic direction of ABHIRISHI INFRA PRIVATE LIMITED, ensuring our commitment to quality and ethical practices.', display_order: 1 },
            { name: 'Mr. Ambikesh', role: 'Director', bio: "Spearheading our daily operations and technological advancements, Mr. Ambikesh's dynamic approach drives our operational efficiency and builds lasting partnerships with industry giants.", display_order: 2 }
        ];
        await TeamMember.insertMany(initialTeam);
    }

    // Seed Equipments
    const eqCount = await Equipment.countDocuments();
    if (eqCount === 0) {
        const initialEquipments = [
            { name: 'Crushing Plants (200/300 TPH)', category: 'Core Operations', display_order: 1 },
            { name: 'Heavy Excavators', category: 'Earthmoving', display_order: 2 },
            { name: 'Wheel Loaders', category: 'Earthmoving', display_order: 3 },
            { name: 'Diesel Bowsers', category: 'Support Vehicles', display_order: 4 },
            { name: 'Site Campers & Tippers', category: 'Transport & Logistics', display_order: 5 },
            { name: 'Mobile Maintenance Units', 'category': 'Support Vehicles', display_order: 6 }
        ];
        await Equipment.insertMany(initialEquipments);
    }

    // Seed Case Studies
    const casesCount = await CaseStudy.countDocuments();
    if (casesCount === 0) {
        const initialCases = [
            { client: 'MKC Infrastructure', type: 'Highway Project', description: 'Supplied high-grade aggregates for a major national highway expansion, ensuring strict adherence to NHAI quality standards.', display_order: 1 },
            { client: 'GR Infraprojects', type: 'Expressway Construction', description: 'Deployed a dedicated 300 TPH plant on-site to meet the massive daily aggregate requirement without any logistical delays.', display_order: 2 },
            { client: 'Megha Engineering', type: 'Irrigation & Dam', description: 'Provided specialized crushing solutions for heavy concrete works in complex terrain.', display_order: 3 },
            { client: 'BR Goyal Infra', type: 'Roadways', description: 'Consistent supply chain management for state highway development over a 24-month period.', display_order: 4 },
            { client: 'Eagle Infra', type: 'Urban Infrastructure', description: 'Navigated strict environmental and noise regulations to supply materials for city-centric infrastructure developments.', display_order: 5 }
        ];
        await CaseStudy.insertMany(initialCases);
    }

    // Seed Partners
    const partnersCount = await Partner.countDocuments();
    if (partnersCount === 0) {
        const initialPartners = [
            { name: 'Ashoka Buildcon', display_order: 1 },
            { name: 'Gayatri Projects', display_order: 2 },
            { name: 'Sushee Infra', display_order: 3 },
            { name: 'KCC Infra', display_order: 4 },
            { name: 'RVR Projects', display_order: 5 }
        ];
        await Partner.insertMany(initialPartners);
    }
};

module.exports = connectDB;
