import mongoose from 'mongoose';

let isConnected = false;  //variable to check if mongoose is connected

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    !process.env.MONGODB_URL && console.log('MONGO_URL not found');

    isConnected && console.log("Already connected to MongoDB");

    try {
        if(!process.env.MONGODB_URL) {
            console.log('Connection_String is not defined');
            return; 
        }
        await mongoose.connect(process.env.MONGODB_URL);

        isConnected = true;

        console.log('Connected to MongoDB');
    } catch (error: any) {
        console.log(error);
    }
}