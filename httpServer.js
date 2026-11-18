
import http from 'http';
import fs from 'fs';

let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5030",
        type: "Hatchback",
        price: 750000
    },
    {
        id: 3,
        vehicleName: "Honda City",
        vehicleNumber: "UP14CD4567",
        type: "Sedan",
        price: 1200000
    }
];


function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(data));
}


function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', reject);
    });
}


const server = http.createServer(async (req, res) => {

    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;

    // Route 1: Home page
    if (req.method === 'GET' && path === '/') {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>Welcome to Vehicle Management System</h1>
            <p>HTTP Server is working successfully.</p>
        `);
    }

    
    else if (req.method === 'GET' && path === '/vehicles') {

        sendJSON(res, 200, vehicles);
    }


    else if (req.method === 'GET' && path === '/about') {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>About Vehicle Management System</h1>
            <p>Developed using Node.js HTTP and FS modules.</p>
        `);
    }

    
    else if (req.method === 'GET' && path === '/info') {

        fs.readFile('./public/info.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);
            }
        });
    }

    
    else if (req.method === 'POST' && path === '/add-vehicle') {

        try {
            const newVehicle = await readBody(req);

            const requiredFields = [
                'id',
                'vehicleName',
                'vehicleNumber',
                'type',
                'price'
            ];

            const valid = requiredFields.every(field =>
                newVehicle[field] !== undefined &&
                newVehicle[field] !== null &&
                newVehicle[field] !== ''
            );

            if (!valid || !Number.isFinite(newVehicle.price) ||
                newVehicle.price <= 0) {

                return sendJSON(res, 400, {
                    message: 'Invalid data or missing required fields'
                });
            }

            vehicles.push(newVehicle);

            sendJSON(res, 201, {
                message: 'Vehicle added successfully',
                vehicle: newVehicle
            });

        } catch (error) {
            sendJSON(res, 400, {
                message: 'Invalid JSON format'
            });
        }
    }

    
    else {
        sendJSON(res, 404, {
            message: '404 - Route Not Found'
        });
    }

});


server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
