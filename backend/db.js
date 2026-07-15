const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL,
                imageUrl TEXT,
                specifications TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE,
                setting_value TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT,
                bio TEXT,
                imageUrl TEXT,
                display_order INTEGER DEFAULT 0
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS equipments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                imageUrl TEXT,
                display_order INTEGER DEFAULT 0
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS case_studies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT,
                imageUrl TEXT,
                display_order INTEGER DEFAULT 0
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS partners (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                display_order INTEGER DEFAULT 0
            )`);

            db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
                if (!row) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync('admin123', salt);
                    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', hash]);
                    console.log('Default admin user created. username: admin, password: admin123');
                }
            });

            // Seed initial settings
            db.get(`SELECT * FROM settings`, [], (err, row) => {
                if (!row) {
                    const initialSettings = [
                        ['company_name', 'ABHIRISHI INFRA PRIVATE LIMITED'],
                        ['phone', '+91 88782 29637'],
                        ['email', 'info@abhirishiinfra.com'],
                        ['address', 'House No 1783, Baliya Kheda, Omaxe City 1, Indore, Madhya Pradesh']
                    ];
                    
                    const stmt = db.prepare(`INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)`);
                    initialSettings.forEach(setting => stmt.run(setting));
                    stmt.finalize();
                }
            });

            // Seed initial team members
            db.get(`SELECT * FROM team_members`, [], (err, row) => {
                if (!row) {
                    const initialTeam = [
                        ['Mr. Rishi Kumar', 'Director', 'With decades of visionary leadership in the infrastructure and construction sector, Mr. Kumar guides the strategic direction of ABHIRISHI INFRA PRIVATE LIMITED, ensuring our commitment to quality and ethical practices.', null, 1],
                        ['Mr. Ambikesh', 'Director', "Spearheading our daily operations and technological advancements, Mr. Ambikesh's dynamic approach drives our operational efficiency and builds lasting partnerships with industry giants.", null, 2]
                    ];
                    const stmt = db.prepare(`INSERT INTO team_members (name, role, bio, imageUrl, display_order) VALUES (?, ?, ?, ?, ?)`);
                    initialTeam.forEach(member => stmt.run(member));
                    stmt.finalize();
                }
            });

            // Seed initial equipments
            db.get(`SELECT * FROM equipments`, [], (err, row) => {
                if (!row) {
                    const initialEquipments = [
                        ['Crushing Plants (200/300 TPH)', 'Core Operations', null, 1],
                        ['Heavy Excavators', 'Earthmoving', null, 2],
                        ['Wheel Loaders', 'Earthmoving', null, 3],
                        ['Diesel Bowsers', 'Support Vehicles', null, 4],
                        ['Site Campers & Tippers', 'Transport & Logistics', null, 5],
                        ['Mobile Maintenance Units', 'Support Vehicles', null, 6]
                    ];
                    const stmt = db.prepare(`INSERT INTO equipments (name, category, imageUrl, display_order) VALUES (?, ?, ?, ?)`);
                    initialEquipments.forEach(eq => stmt.run(eq));
                    stmt.finalize();
                }
            });

            // Seed initial Case Studies
            db.get(`SELECT * FROM case_studies`, [], (err, row) => {
                if (!row) {
                    const initialCases = [
                        ['MKC Infrastructure', 'Highway Project', 'Supplied high-grade aggregates for a major national highway expansion, ensuring strict adherence to NHAI quality standards.', null, 1],
                        ['GR Infraprojects', 'Expressway Construction', 'Deployed a dedicated 300 TPH plant on-site to meet the massive daily aggregate requirement without any logistical delays.', null, 2],
                        ['Megha Engineering', 'Irrigation & Dam', 'Provided specialized crushing solutions for heavy concrete works in complex terrain.', null, 3],
                        ['BR Goyal Infra', 'Roadways', 'Consistent supply chain management for state highway development over a 24-month period.', null, 4],
                        ['Eagle Infra', 'Urban Infrastructure', 'Navigated strict environmental and noise regulations to supply materials for city-centric infrastructure developments.', null, 5]
                    ];
                    const stmt = db.prepare(`INSERT INTO case_studies (client, type, description, imageUrl, display_order) VALUES (?, ?, ?, ?, ?)`);
                    initialCases.forEach(c => stmt.run(c));
                    stmt.finalize();
                }
            });

            // Seed initial Partners
            db.get(`SELECT * FROM partners`, [], (err, row) => {
                if (!row) {
                    const initialPartners = [
                        ['Ashoka Buildcon', 1],
                        ['Gayatri Projects', 2],
                        ['Sushee Infra', 3],
                        ['KCC Infra', 4],
                        ['RVR Projects', 5]
                    ];
                    const stmt = db.prepare(`INSERT INTO partners (name, display_order) VALUES (?, ?)`);
                    initialPartners.forEach(p => stmt.run(p));
                    stmt.finalize();
                }
            });
        });
    }
});

module.exports = db;
