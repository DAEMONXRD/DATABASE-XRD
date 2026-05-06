const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// ഗ്ലോബൽ വേരിയബിൾ - ഡാറ്റ മെമ്മറിയിൽ സൂക്ഷിക്കാൻ
let cachedData = [];

// സെർവർ സ്റ്റാർട്ട് ചെയ്യുമ്പോൾ ഡാറ്റ ലോഡ് ചെയ്യാനുള്ള ഫങ്ക്ഷൻ
const loadDatabase = () => {
    console.log("Loading database parts into memory...");
    let tempArray = [];
    
    for (let i = 1; i <= 6; i++) {
        const fileName = `db_part_${i}.json`;
        const filePath = path.join(__dirname, fileName);
        
        if (fs.existsSync(filePath)) {
            try {
                const rawData = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(rawData);
                
                if (Array.isArray(jsonData)) {
                    tempArray = tempArray.concat(jsonData);
                } else if (jsonData["1-50k"] && Array.isArray(jsonData["1-50k"])) {
                    tempArray = tempArray.concat(jsonData["1-50k"]);
                }
                console.log(`✅ Loaded ${fileName}`);
            } catch (e) {
                console.error(`❌ Error reading ${fileName}:`, e.message);
            }
        } else {
            console.warn(`⚠️ Warning: ${fileName} not found.`);
        }
    }
    cachedData = tempArray;
    console.log(`🚀 Database loaded. Total records: ${cachedData.length}`);
};

// ആപ്പ് തുടങ്ങുമ്പോൾ തന്നെ ഡാറ്റ ലോഡ് ചെയ്യുന്നു
loadDatabase();

app.get('/', (req, res) => {
    res.json({
        status: 'Online',
        message: 'Database API is running smoothly',
        developer: 'DaemonXRD',
        total_records: cachedData.length
    });
});

app.get('/api', (req, res) => {
    const mobile = req.query.number;

    if (!mobile) {
        return res.status(400).json({ 
            error: 'Please provide a mobile number',
            developer: 'DaemonXRD'
        });
    }

    // പവർഫുൾ സെർച്ചിംഗ് (മെമ്മറിയിൽ നിന്ന് നേരിട്ട്)
    const result = cachedData.find(item => String(item.Phone_Mobile).includes(mobile));

    if (!result) {
        return res.status(404).json({ 
            error: 'Mobile number not found',
            developer: 'DaemonXRD' 
        });
    }

    // ഡെവലപ്പർ ക്രെഡിറ്റ്സ് ചേർക്കുന്നു
    res.json({
        ...result,
        developer: 'Developed by DaemonXRD',
        source: 'XRD Legion Database'
    });
});

app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`Server is live on port ${PORT}`);
    console.log(`Developed by DaemonXRD`);
    console.log(`-------------------------------------------`);
});
