const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// ഓരോ ഫയലായി സെർച്ച് ചെയ്യാനുള്ള ഫങ്ക്ഷൻ
const searchInFiles = (mobileNumber) => {
    for (let i = 1; i <= 6; i++) {
        const fileName = `db_part_${i}.json`;
        const filePath = path.join(__dirname, fileName);

        if (fs.existsSync(filePath)) {
            try {
                const rawData = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(rawData);
                
                // ഡാറ്റ ലിസ്റ്റ് ആണോ എന്ന് നോക്കുന്നു
                const dataArray = Array.isArray(jsonData) ? jsonData : jsonData["1-50k"];

                if (dataArray) {
                    const found = dataArray.find(item => String(item.Phone_Mobile) === String(mobileNumber));
                    if (found) return found; // നമ്പർ കിട്ടിയാൽ ഉടൻ ആ ഡാറ്റ തിരിച്ചു നൽകുന്നു
                }
            } catch (e) {
                console.error(`Error reading ${fileName}:`, e.message);
            }
        }
    }
    return null; // ആറ് ഫയലിലും ഇല്ലെങ്കിൽ null നൽകും
};

app.get('/', (req, res) => {
    res.json({
        status: 'Active',
        developer: 'DaemonXRD',
        endpoint: '/api?number=YOUR_NUMBER'
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

    try {
        const result = searchInFiles(mobile);

        if (!result) {
            return res.status(404).json({ 
                error: 'Mobile number not found in database',
                developer: 'DaemonXRD' 
            });
        }

        // ഫൈനൽ ഔട്ട്‌പുട്ട്
        res.json({
            ...result,
            developer: 'Developed by DaemonXRD',
            source: 'XRD Legion Secure API'
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Internal Server Error', 
            developer: 'DaemonXRD' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Memory Optimized Search Active`);
    console.log(`Developed by DaemonXRD`);
});
