const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// ไม่ต้องเปลี่ยนอะไรในส่วนนี้
app.use(cors());
app.use(bodyParser.json());
app.use('/css', express.static(__dirname + '/css'));
app.use('/script', express.static(__dirname + '/script'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // กำหนด path ให้ตรงกับไฟล์ของคุณ
});

let sensorData = {
    distance: '',
    humidity: '',
    temperature: '',
    ldr: '',
    pH: '',          // เพิ่มค่า pH ใน sensorData
    pumpState: false, // เริ่มต้น pumpState เป็น false
    isFlowing: false  // เพิ่ม isFlowing
};

// Endpoint สำหรับรับข้อมูลเซ็นเซอร์
app.post('/sensor', (req, res) => {
    const { distance, humidity, temperature, ldr, pH, isFlowing } = req.body;

    if (distance !== undefined) sensorData.distance = distance;
    if (humidity !== undefined) sensorData.humidity = humidity;
    if (temperature !== undefined) sensorData.temperature = temperature;
    if (ldr !== undefined) sensorData.ldr = ldr;
    if (pH !== undefined) sensorData.pH = pH; // เพิ่มการจัดการค่า pH
    if (isFlowing !== undefined) sensorData.isFlowing = isFlowing;

    console.log(`Distance: ${sensorData.distance} cm`);
    console.log(`Humidity: ${sensorData.humidity}%`);
    console.log(`Temperature: ${sensorData.temperature}°C`);
    console.log(`LDR: ${sensorData.ldr}`);
    console.log(`pH: ${sensorData.pH}`); // แสดงค่า pH ใน console
    console.log(`Pump State: ${sensorData.pumpState}`);
    console.log(`Is Flowing: ${sensorData.isFlowing}`);

    res.send('Data received');
});

// Endpoint สำหรับควบคุมปั๊มน้ำ
app.post('/togglePump', (req, res) => {
    const { pumpState } = req.body;

    if (pumpState !== undefined) {
        sensorData.pumpState = pumpState;
        // ใช้การแปลงค่าของ pumpState เป็น 1 หรือ 0 สำหรับ isFlowing
        sensorData.isFlowing = pumpState ? 1 : 0; 
        console.log(`Pump State updated to: ${sensorData.pumpState}`);
        console.log(`Is Flowing updated to: ${sensorData.isFlowing}`);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/data', (req, res) => {
    res.json(sensorData);
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});
