const express = require("express");
const router = express.Router();
const connectDB = require("../model/database"); // Importa la conexión

// guardar una comida en el calendario
router.post("/calendar", async (req, res) => {
    const { day, meal_type, meal_name } = req.body;

    try {
        const query = `
            INSERT INTO calendar (day, meal_type, meal_name) 
            VALUES (?, ?, ?)`;

        await connectDB.promise().execute(query, [day, meal_type, meal_name]);
        res.status(200).json({ message: "Meal saved successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error });
    }
});

// obtener el calendario completo
router.get("/calendar", async (req, res) => {
    try {
        const [result] = await connectDB.promise().execute("SELECT * FROM calendar ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')");
        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error });
    }
});

// guardar un item en la lista de compras
router.post("/grocery-list", async (req, res) => {
    const { item_name, quantity } = req.body;

    try {
        const query = `
            INSERT INTO grocery_list (item_name, quantity, completed) 
            VALUES (?, ?, false)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;

        await connectDB.promise().execute(query, [item_name, quantity]);
        res.status(200).json({ message: "Item in grocery list" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error });
    }
});

// obtener la lista de compras 
router.get("/grocery-list", async (req, res) => {
    try {
        const [result] = await connectDB.promise().execute("SELECT * FROM grocery_list");

        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch grocery list" });
    }
});

// marcar un ítem como completado
router.put("/grocery-list/:item_name", async (req, res) => {
    const { item_name } = req.params;
    const { completed } = req.body;
    const completedValue = completed ? 1 : 0;

    try {
        const query = `UPDATE grocery_list SET completed = ? WHERE item_name = ?`;
        const [result] = await connectDB.promise().execute(query, [completedValue, item_name]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error });
        }

        res.status(200).json({ message: "Grocery item updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error });
    }
});

// delete a meal from the calendar
router.delete("/calendar/:id", async (req, res) => {
    const mealId = req.params.id;

    try {
        const query = `DELETE FROM calendar WHERE id = ?`;
        const [result] = await connectDB.promise().execute(query, [mealId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error });
        }

        res.status(200).json({ message: "Meal deleted successfully!" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error });
    }
});

// delete an item from the grocery list
router.delete("/grocery-list/:item_name", async (req, res) => {
    const { item_name } = req.params;

    try {
        const query = `DELETE FROM grocery_list WHERE item_name = ?`;
        const [result] = await connectDB.promise().execute(query, [item_name]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error });
    }
});



module.exports = router;
