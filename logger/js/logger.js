const dotenv = require('dotenv');
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
// log("backend","debug","db","test log");