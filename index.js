const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// എല്ലാ ഡാറ്റയും ഒന്നിച്ച് ലോഡ് ചെയ്യാനുള്ള ഫങ്ക്ഷൻ
const getCombinedData = () => {
    let combinedData = [];
    for (let i = 1; i <= 6; i++) {
        const fileName = `db_part_${i}.json`;
        const filePath = path.join(__dirname, fileName);
        
        if (fs.existsSync(filePath)) {
            try {
                const rawData = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(rawData);
                
                // ഡാറ്റ നേരിട്ട് ലിസ്റ്റ് ആണെങ്കിൽ (നമ്മൾ സ്പ്ലിറ്റ് ചെയ്ത പോലെ)
                if (Array.isArray(jsonData)) {
                    combinedData = combinedData.concat(jsonData);
                } 
                // ഒരുപക്ഷേ പഴയ പോലെ കീ ഉണ്ടെങ്കിൽ
                else if (jsonData["1-50k"] && Array.isArray(jsonData["1-50k"])) {
                    combinedData = combinedData.concat(jsonData["1-50k"]);
                }
            } catch (e) {
                console.error(`Error reading ${fileName}:`, e.message);
            }
        }
    }
    return combinedData;
};

app.get('/', (req, res) => {
    res.json({
        message: 'API is running...',
        developer: 'DaemonXRD'
    });
});

app.get('/api', (req, res) => {
    const mobile = Number(req.query.number);

    if (!mobile) {
        return res.status(400).json({ 
            error: 'Please provide a valid mobile number',
            developer: 'DaemonXRD'
        });
    }

    try {
        const allData = getCombinedData();
        
        // മൊബൈൽ നമ്പർ വെച്ച് ഫിൽട്ടർ ചെയ്യുന്നു
        const foundItem = allData.find(
            item => Number(item.Phone_Mobile) === mobile
        );

        if (!foundItem) {
            return res.status(404).json({ 
                error: 'Mobile number not found',
                developer: 'DaemonXRD' 
            });
        }

        // റിസൾട്ടിനൊപ്പം ഡെവലപ്പർ ക്രെഡിറ്റ്സ് ചേർക്കുന്നു
        const response = {
            ...foundItem,
            developer: 'Developed by DaemonXRD',
            status: 'Verified Database Result'
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Server Error', 
            developer: 'DaemonXRD' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database parts 1-6 integrated.');
    console.log('Developed by DaemonXRD');
});
