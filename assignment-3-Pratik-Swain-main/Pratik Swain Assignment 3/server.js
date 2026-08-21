const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { User } = require("./model/restaurant");
const restaurantRouter = require("./router/restaurantrouter");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.path, new Date().toLocaleTimeString());
    next();
});

app.get("/", (req, response) => {
    response.json({ message: "Welcome to Restaurant API" });
});

app.post("/register", async (req, response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return response.status(400).json({ message: "All fields required" });

        const exists = await User.findOne({ email });

        if (exists)
            return response.status(400).json({ message: "User already exists" });

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hash
        });

        response.status(201).json({ message: "Registered successfully" });

    } catch {
        response.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return response.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        response.json({
            message: "Login successful",
            token
        });

    } catch {
        response.status(500).json({ message: "Server error" });
    }
});

app.use("/", restaurantRouter);

connectDB()
    const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
