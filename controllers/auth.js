import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "../db/initSupabase.js"

/* SIGNUP */
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const { data, error } = await db.from('user').insert({
            name: name,
            password: passwordHash,
            email: email
        }).select()

        delete data[0].password

        res.status(201).json({ message: "User successfully signed up", data, error })
    } catch (err) {
        res.status(500).json({ message: "Could not sign up", error: err.message })
    }
}

/* LOGIN */
export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        
        const { data, error } = await db.from('user').select().eq('email', email)
        
        if(error) {
            return res.status(400).json({ message: "Could not find user", error })
        }
        
        const isMatch = await bcrypt.compare(password, data[0].password)
        
        if(!isMatch) {
            return res.status(400).json({ message: "Could not log in", error: "Invalid password" })
        }

        const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET)
        delete data[0].password

        res.status(200).json({ message: "User successfully logged in", token, data })
    } catch (err) {
        res.status(500).json({ message: "Could not log in", error: err.message })
    }
}