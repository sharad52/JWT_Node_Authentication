const mongoose = require("mongoose")

const { MONGO_URI } = process.env

exports.connect = () => {
    mongoose 
        .connect(MONGO_URI)
        .then(() => {
            console.log('Successfully connected to the database.')
        })
        .catch((err) => {
            console.log("Database connection failed. exiting now...");
            console.error(err);
            process.exit(1);
        });
};