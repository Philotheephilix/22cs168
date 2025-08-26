const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

//logger service
dotenv.config();
function log(stack,level,package_name,message){
    fetch('http://20.244.56.144/evaluation-service/logs',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            stack,
            level,
            package:package_name,
            message
        })
    }).then(res => res.json()).then(data => {
        console.log('Log sent:', data);
    }).catch((error) => {
        console.error('Error:', error);
    });
}

const app = express();
app.use(cors());
app.use(express.json());
const shortUrls = [];

app.post('/shorturls', (req, res) => {
    const { url, preferredCode, expireTime } = req.body;
    const shortUrl = `http://localhost:3001/${preferredCode+uuidv4().slice(0, 8)}`;
    const expiry = expireTime ? new Date(Date.now() + expireTime * 60000) : new Date(Date.now() + 30 * 60000);
    shortUrls.push({ url, shortUrl, preferredCode, expiry, clicks: [] });
    res.json({ shortLink: shortUrl, expiry });
});

app.get('/shorturls/:code', (req, res) => {
    const url = decodeURIComponent(req.params.code);
    const entry = shortUrls.find(su => su.url === url);
    if (!entry) {
        return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({ entry });
}); 

app.post('/log', (req, res) => {
    const { stack, level, package_name, message } = req.body;
    log(stack, level, package_name, message);
    res.status(200).json({ status: 'Log received' });
});

app.get('/:code', (req, res) => {
    const { code } = req.params ;
    const entry = shortUrls.find(su => su.preferredCode === code || su.shortUrl.endsWith(code));
    if (!entry) {
        return res.status(404).json({ error: 'Short URL not found' });
    }
    if (new Date() > entry.expiry) {
        return res.status(410).json({ error: 'Short URL has expired' });
    }
    const referrer = req.get('referer') || null;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
    entry.clicks.push({ 
        timestamp: new Date(),
        referrer,
        ip
    });
    res.redirect(entry.url);
});

try{
    app.listen(3001, () => {
    console.log('Server running on port 3001');
    });
}catch(error){
    logger("backend","fatal","service",`Server failed to start: ${error.message}`);
}
