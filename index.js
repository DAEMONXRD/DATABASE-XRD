const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 📁 നിങ്ങളുടെ 6 ഡാറ്റാബേസ് ഫയലുകൾ
const DB_FILES = [
    'db_part_1.json',
    'db_part_2.json',
    'db_part_3.json',
    'db_part_4.json',
    'db_part_5.json',
    'db_part_6.json'
];

/**
 * 🔍 നമ്പറിന് വേണ്ടിയുള്ള തിരച്ചിൽ
 * ഓരോ ഫയലായി തുറന്ന് ചെക്ക് ചെയ്യും, കണ്ടുകഴിഞ്ഞാൽ ഉടൻ നിർത്തും.
 */
const searchAcrossFiles = (targetNumber) => {
    for (const file of DB_FILES) {
        try {
            const filePath = path.join(__dirname, file);
            
            if (fs.existsSync(filePath)) {
                // സിസ്റ്റം മെമ്മറി ലാഭിക്കാൻ ഫയൽ റീഡ് ചെയ്യുന്നു
                const fileData = fs.readFileSync(filePath, 'utf8');
                const jsonArray = JSON.parse(fileData);

                // നമ്പറിൽ സ്പേസ് ഉണ്ടെങ്കിൽ അത് കളയാൻ trim() ഉപയോഗിക്കുന്നു
                const found = jsonArray.find(item => 
                    String(item.Phone_Mobile).trim() === String(targetNumber).trim()
                );

                if (found) return found; // കിട്ടിയാൽ ഉടൻ ഈ ലൂപ്പ് നിർത്തി റിസൾട്ട് നൽകും
            }
        } catch (err) {
            console.error(`Error reading ${file}:`, err.message);
        }
    }
    return null;
};

// --- ROUTES ---

// 1. ഹോം പേജ് (സെർവർ വർക്കിംഗ് ആണോ എന്ന് നോക്കാൻ)
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #1a73e8;">XRD Legion Database System</h1>
            <p style="color: #5f6368;">Status: <b style="color: #34a853;">Live on Render</b></p>
            <p>Developed by <b>DaemonXRD</b></p>
        </div>
    `);
});

// 2. മെയിൻ സെർച്ച് API (?number= നൊപ്പം ഉപയോഗിക്കുക)
app.get('/api', (req, res) => {
    const mobileNumber = req.query.number;

    if (!mobileNumber) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide a mobile number in the URL. Example: /api?number=9876543210" 
        });
    }

    const result = searchAcrossFiles(mobileNumber);

    if (result) {
        return res.json({
            success: true,
            developer: "DaemonXRD",
            data: result
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "No record found in the database.",
            developer: "DaemonXRD"
        });
    }
});

// സെർവർ സ്റ്റാർട്ട് ചെയ്യുന്നു
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 DaemonXRD Search Engine Active!`);
    console.log(`📡 Listening on Port: ${PORT}`);
    console.log(`📂 Database Files: 6 JSON parts ready.`);
    console.log(`-----------------------------------------`);
});
