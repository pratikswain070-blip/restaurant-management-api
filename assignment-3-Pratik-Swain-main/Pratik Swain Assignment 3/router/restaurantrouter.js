const express= require("express");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const { Restaurant, User } = require("../model/restaurant");

const router= express.Router();

function auth(req, response, next) {
    try {
        const token = req.headers.authorization;
        console.log(token);
        jwt.verify(token, process.env.JWT_SECRET);
        console.log(token);
        next();
    } catch {
        response.status(401).json({ message: "Unauthorized" });
    }
}

router.get("/restaurants", async (req, response) => {
    try {
        response.json(await Restaurant.find());
    } catch {
        response.status(500).json({ message: "Server error" });
    }
});

router.get("/restaurants/top", async (req, response) => {
    try {
        response.json(await Restaurant.find().sort({ rating: -1 }).limit(5));
    } catch {
        response.status(500).json({ message: "Server error" });
    }
});

router.get("/restaurants/:id", async (req, response) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant)
            return response.status(404).json({ message: "Restaurant not found" });
        response.json(restaurant);
    } catch {
        response.status(400).json({ message: "Invalid ID" });
    }
});

router.post("/restaurants", auth, async (req, response) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        response.status(201).json(restaurant);
    } catch {
        response.status(400).json({ message: "Invalid data" });
    }
});

router.put("/restaurants/:id", auth, async (req, response) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!restaurant)
            return response.status(404).json({ message: "Restaurant not found" });

        response.json(restaurant);
    } catch {
        response.status(400).json({ message: "Invalid data" });
    }
});


router.delete("/restaurants/:id", auth, async (req, response) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant)
            return response.status(404).json({ message: "Restaurant not found" });

        await Menu.deleteMany({ restaurantId: req.params.id });

        response.json({ message: "Restaurant deleted" });
    } catch {
        response.status(400).json({ message: "Invalid ID" });
    }
});

router.get("/restaurants/:id/menu", async (req, response) => {
    try {
        response.json(await Menu.find({ restaurantId: req.params.id }));
    } catch {
        response.status(400).json({ message: "Invalid ID" });
    }
});

router.post("/restaurants/:id/menu", auth, async (req, response) => {
    try {
        const menu = await Menu.create({
            ...req.body,
            restaurantId: req.params.id
        });

        response.status(201).json(menu);
    } catch {
        response.status(400).json({ message: "Invalid data" });
    }
});

router.put("/menu/:id", auth, async (req, response) => {
    try {
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menu)
            return response.status(404).json({ message: "Menu not found" });

        response.json(menu);
    } catch {
        response.status(400).json({ message: "Invalid ID" });
    }
});

router.delete("/menu/:id", auth, async (req, response) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);

        if (!menu)
            return response.status(404).json({ message: "Menu not found" });

        response.json({ message: "Menu deleted" });
    } catch {
        response.status(400).json({ message: "Invalid ID" });
    }
});

module.exports = router;