//Node.js framework
import express from "express"
//Process request body
import bodyParser from "body-parser"
//Cross-origin Resource Sharing
import cors from "cors"
//Environment variables
import dotenv from "dotenv"
//File upload and storage
import multer from "multer"
//Request safety
import helmet from "helmet"
//Log middleware
import morgan from "morgan"
//Project path
import path from "path"
import { fileURLToPath } from "url"
/* Local imports */
//import authRoutes from "./routes/auth.js"
//import userRoutes from "./routes/user.js"
//import addProfilePhoto from "./controllers/user.js"

/* GENERAL CONFIG */
const __filename = fileURLToPath(import.meta.url)
const __dirname =  path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },
})
const upload = multer({ storage })

/* ROUTES WITH FILES */
//app.post("/user/photo", verifyToken, upload.single("picture"), addProfilePhoto)

/* ROUTES */
//app.use("/auth", authRoutes);
//app.use("/user", userRoutes);

/* SERVER CONFIG */
const PORT = process.env.PORT || 3303
app.listen(PORT, () => console.log(`Server Port ${PORT} running.`))