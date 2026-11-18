
import express from 'express';

const app = express();


app.use(express.json());


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

function isValidVehicle(vehicle) {
    return (
        vehicle.vehicleName &&
        vehicle.vehicleNumber &&
        vehicle.type &&
        Number.isFinite(vehicle.price) &&
        vehicle.price > 0
    );
}

app.get('/vehicles', (req, res) => {

    res.status(200).json(vehicles);

});


app.get('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    res.status(200).json(vehicle);

});


app.post('/vehicles', (req, res) => {

    const newVehicle = req.body;

    if (
        newVehicle.id === undefined ||
        !Number.isInteger(newVehicle.id) ||
        !isValidVehicle(newVehicle)
    ) {
        return res.status(400).json({
            message: 'Please provide valid vehicle details'
        });
    }

    const existingVehicle = vehicles.find(
        v => v.id === newVehicle.id
    );

    if (existingVehicle) {
        return res.status(400).json({
            message: 'Vehicle ID already exists'
        });
    }

    vehicles.push(newVehicle);

    res.status(201).json({
        message: 'Vehicle added successfully',
        vehicle: newVehicle
    });

});


app.put('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const updatedVehicle = {
        ...vehicle,
        ...req.body,
        id: vehicle.id
    };

    if (!isValidVehicle(updatedVehicle)) {
        return res.status(400).json({
            message: 'Invalid vehicle details'
        });
    }

    Object.assign(vehicle, updatedVehicle);

    res.status(200).json({
        message: 'Vehicle updated successfully',
        vehicle: vehicle
    });

});


app.delete('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const deletedVehicle = vehicles.splice(index, 1);

    res.status(200).json({
        message: 'Vehicle deleted successfully',
        vehicle: deletedVehicle[0]
    });

});


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: 'Invalid JSON format'
        });
    }

    next(err);
});


app.use((req, res) => {

    res.status(404).json({
        message: '404 - Route Not Found'
    });

});


app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
