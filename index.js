const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// ഫയലുകൾ സെർച്ച് ചെയ്യാനുള്ള ഫങ്ക്ഷൻ (Vercel/Render Compatibility)
const searchDatabase = (mobileNumber) => {
    // 6 ഫയലുകളിലൂടെ ലൂപ്പ് ചെയ്യുന്നു
    for (let i = 1; i <= 6; i++) {
        try {
            const fileName = `db_part_${i}.json`;
            // ഫയൽ പാത്ത് കൃത്യമായി എടുക്കുന്നു
            const filePath = path.resolve(__dirname, fileName);

            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(rawData);
                
                // ഡാറ്റ സ്ട്രക്ചർ ചെക്ക് ചെയ്യുന്നു
                const dataArray = Array.isArray(jsonData) ? jsonData : jsonData["1-50k"];

                if (dataArray) {
                    // നമ്പർ മാച്ച് ചെയ്യുന്നുണ്ടോ എന്ന് നോക്കുന്നു
                    const found = dataArray.find(item => String(item.Phone_Mobile) === String(mobileNumber));
                    if (found) return found; 
                }
            }
        } catch (err) {
            console.error(`Error processing file ${i}:`, err.message);
        }
    }
    return null;
};

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1>XRD Legion API is Live</h1>
            <p>Developed by <b>DaemonXRD</b></p>
            <p style="color: green;">Status: Running (Optimized)</p>
        </div>
    `);
});

app.get('/api', (req, res) => {
    const mobile = req.query.number;

    if (!mobile) {
        return res.status(400).json({ 
            error: 'Please provide a mobile number',
            developer: 'DaemonXRD'
        });
    }

    const result = searchDatabase(mobile);

    if (!result) {
        return res.status(404).json({ 
            error: 'No records found for this number',
            developer: 'DaemonXRD' 
        });
    }

    // പക്ക റിസൾട്ട് ക്രെഡിറ്റ്സിനോടൊപ്പം
    res.json({
        ...result,
        developer: 'Developed by DaemonXRD',
        database: 'XRD Legion Secure V1'
    });
});

// സെർവർ ലിസണിംഗ്
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Server Running on Port: ${PORT}`);
    console.log(`👨‍💻 Developed by DaemonXRD`);
    console.log(`📁 Database: 6 Parts Integrated`);
    console.log(`=================================`);
});
