import mongoose from "mongoose";
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

import { User } from "../model/userModel.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`Connected to database`))
    .catch(error => console.error(`Database connection error: ${error}`));

const seedUsers = async () => {
    try {
        const newUsers = [
                {
                    lastName: "Employee2",  
                    firstName: "Employee2",
                    middleName: "Middle",
                    email: "employee2@example.com",
                    password: await bcryptjs.hash("employeepassword123", 10),
                    role: "Employee",
                    position: "Sales Representative",
                    bDate: new Date("1995-06-15"),
                    gender: "Male",
                    phoneNumber: "09123456789",
                    address: {
                        country: "Philippines",
                        province: "Metro Manila",
                        municipality: "Quezon City",
                        street: "123 Example Street",
                        postalCode: "1100",
                    },
                },
            ];
        const emails = newUsers.map(user => user.email);

        const existingUsers = await User.find({ email: { $in: emails } });

        const existingEmails = existingUsers.map(user => user.email);

        if (existingEmails.length > 0) {
            console.log(`Deleting existing users with emails: ${existingEmails.join(', ')}`);
            await User.deleteMany({ email: { $in: existingEmails } });
        }

        await User.insertMany(newUsers);
        console.log("Users created successfully");
    } catch (error) {
        console.log(`Error in seeding: ${error}`);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers();
