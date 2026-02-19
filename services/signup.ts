let db: null | any = null

import bcrypt from 'bcrypt'
import { MongoClient } from "mongodb"
MongoClient.connect("mongodb://localhost:27017")

.then((conn)=>{
    db = conn.db("ebook")
})

.catch((err)=>{
    chalk.red("Failed to connect with database")
    process.exit()
})

import chalk from "chalk";
import inquirer from "inquirer";
const log = console.log

log(chalk.bgRed.white.bold.underline(" 🌟 Admin Signup Console 🌟 "))

const options: any = [{
    type: "list",
    name: "role",
    message: "Press arrow up and down key to choose role - ",
    choices: [
        chalk.green("User"),
        chalk.blue("Admin"),
        chalk.red("Exit")
    ]
}]

const input: any = [
    {
        type: "input",
        name: "fullname",
        message: "Enter your Fullname ?",
        validate: (input: any)=>{
            return input.length > 0 ? true : "Fullname is required !"
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter your Email ?",
        validate: (input: any)=>{
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if(!input.length)
                return "Email is required !"

            if(!emailRegex.test(input))
                return "Invalid email id !"

            return true
        }
    },
    {
        type: "input",
        name: "mobile",
        message: "Enter your Mobile ?",
        validate: (input: any)=>{
            const mobileRegex = /^\d{10}$/;

            if(!input.length)
                return "Mobile is required !"

            if(!mobileRegex.test(input))
                return "Invalid mobile !"

            return true
        }
    },
    {
        type: "password",
        name: "password",
        message: "Enter your Password ?",
        mask: "*",
        validate: (input: any)=>{
            if(!input.length)
                return "Password is required !"

            if(input.length < 6)
                return "Password should be atleast 6 characters !"

            return true
        }
    }
]

const addUser = async ()=>{
    try {
        const user = await inquirer.prompt(input)
        user.role = "user"
        user.password = await bcrypt.hash(user.password, 12)
        const userCollection = db.collection("users")
        await userCollection.insertOne(user)
        log(chalk.green("User has been created !"))
        process.exit()
    }
    catch(err)
    {
        chalk.red("Failed to create user please consult to developer")
    }
}

const addAdmin = async ()=>{
    try {
        const user = await inquirer.prompt(input)
        user.role = "admin"
        user.password = await bcrypt.hash(user.password, 12)
        const userCollection = db.collection("users")
        await userCollection.insertOne(user)
        log(chalk.green("Admin has been created !"))
        process.exit()
    }
    catch(err)
    {
        chalk.red("Failed to create admin please consult to developer")
    }
}

const exit = ()=>{
    log(chalk.blue("Goodbye! Exiting the program."))
    process.exit()
}

const createUser = async ()=>{
    try {
        const option = await inquirer.prompt(options)

        if(option.role.includes("User"))
            return addUser()

        if(option.role.includes("Admin"))
            return addAdmin()

        if(option.role.includes("Exit"))
            return exit()
    }
    catch(err)
    {
        chalk.red("Something is not right")
    }
}

createUser()