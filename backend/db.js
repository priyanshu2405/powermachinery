const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Setting, TeamMember, Equipment, CaseStudy, Partner, RentalMachine } = require('./models');

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
    const defaultSettings = [
        { setting_key: 'company_name', setting_value: 'ABHIRISHI INFRA PRIVATE LIMITED' },
        { setting_key: 'phone', setting_value: '+91 88782 29637' },
        { setting_key: 'email', setting_value: 'info@abhirishiinfra.com' },
        { setting_key: 'address', setting_value: 'House No 1783, Baliya Kheda, Omaxe City 1, Indore, Madhya Pradesh' },
        { setting_key: 'about_title', setting_value: 'About Us' },
        { setting_key: 'about_lead', setting_value: 'We are industry leaders in providing robust infrastructure support through our state-of-the-art crushing plants.' },
        { setting_key: 'about_text_1', setting_value: 'At ABHIRISHI INFRA PRIVATE LIMITED, we believe in laying the strongest foundations. We specialize in the operation and management of advanced 200/300 TPH crushing plants, delivering high-quality aggregates for mega infrastructure projects across the nation.' },
        { setting_key: 'about_text_2', setting_value: 'Our operations are deeply rooted in ethical practices, ensuring transparency, environmental consciousness, and unwavering reliability for our partners.' },
        { setting_key: 'about_image', setting_value: '' }
    ];

    for (const s of defaultSettings) {
        const exists = await Setting.findOne({ setting_key: s.setting_key });
        if (!exists) {
            await Setting.create(s);
        }
    }

    // Seed Team Members
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
        const initialTeam = [
            { name: 'Mr. Abikesh Shukla', role: 'Director', bio: "Spearheading our daily operations and technological advancements, Mr. Abikesh's dynamic approach drives our operational efficiency and builds lasting partnerships with industry giants.", display_order: 1 },
            { name: 'Mr. Rishi Shukla', role: 'Director', bio: 'With decades of visionary leadership in the infrastructure and construction sector, Mr. Rishi Shukla guides the strategic direction of ABHIRISHI INFRA PRIVATE LIMITED, ensuring our commitment to quality and ethical practices.', display_order: 2 }
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

    // Seed Rental Machines
    const rentalsCount = await RentalMachine.countDocuments();
    if (rentalsCount === 0) {
        const initialRentals = [
            {
                name: 'SANY SY215C Heavy Excavator',
                price: '₹1,80,000 / Month',
                imageUrls: [],
                details: 'Operating weight of 21.5 tons. Cummins engine with 150 HP. Bucket capacity of 1.0 m³. Best suited for heavy-duty earthmoving, quarrying, and site preparation. Extremely fuel efficient with high-speed performance.',
                display_order: 1
            },
            {
                name: 'L&T 9020 Wheel Loader',
                price: '₹1,20,000 / Month',
                imageUrls: [],
                details: 'High productivity wheel loader with 3.0 m³ bucket capacity. Powered by a fuel-efficient engine. Ideal for aggregate loading, bulk handling, and construction site chores. Superior dump clearance and spacious cabin.',
                display_order: 2
            }
        ];
        await RentalMachine.insertMany(initialRentals);
        console.log('Default rental machines seeded');
    }
};

module.exports = connectDB;
