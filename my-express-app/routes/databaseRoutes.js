const express = require("express");
const router = express.Router();
const connectDB = require("../model/database"); // Importa la conexión
const axios = require("axios");

const userMustBeLoggedIn = require("../guards/userMustBeLoggedIn");

// guardar una comida en el calendario
//to add to calendar, need userID, day, meal_type, meal_name & meal_img_url
router.post(
  "/calendar",
  userMustBeLoggedIn,
  async (req, res) => {
    const {
      userID,
      day,
      dbID,
      meal_type,
      meal_name,
      meal_img_url,
    } = req.body;

    try {
      const putQuery = `
            INSERT INTO calendar (userID, day, dbID, meal_type, meal_name, meal_img_url) 
            VALUES (?, ?, ?, ?, ?, ?)`;
      const getQuery =
        "SELECT * FROM calendar WHERE userID = ? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')";

      const result = await connectDB
        .promise()
        .execute(putQuery, [
          req.user_id,
          day,
          dbID,
          meal_type,
          meal_name,
          meal_img_url,
        ]);
      const [updatedCalendar] = await connectDB
        .promise()
        .execute(getQuery, [req.user_id]);
      Promise.all([result, updatedCalendar]).then(
        (values) =>
          res.status(200).send({
            result: values[0],
            updatedCalendar: values[1],
          })
      );
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);
// obtener el calendario completo
router.get(
  "/calendar",
  userMustBeLoggedIn,
  async (req, res) => {
    const query =
      "SELECT * FROM calendar WHERE userID = ? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')";
    try {
      const [result] = await connectDB
        .promise()
        .execute(query, [req.user_id]);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

// guardar un item en la lista de compras
//to add to grocery_list, need name, quantity_num, quantity_measure & mealID
router.post(
  "/grocery-list",
  userMustBeLoggedIn,
  async (req, res) => {
    const {
      userID,
      item_name,
      quantity,
      mealID,
    } = req.body;
    const name_lowercase =
      item_name.toLowerCase();
    try {
      const query = `
            INSERT INTO grocery_list (userID, item_name, quantity, mealID, completed) 
            VALUES (?, ?,  ?, ?, false)
        `;

      await connectDB
        .promise()
        .execute(query, [
          req.user_id,
          name_lowercase,
          quantity,
          mealID,
        ]);
      res.status(200).json({
        message: "Item in grocery list",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

// obtener la lista de compras
router.get(
  "/grocery-list",
  userMustBeLoggedIn,
  async (req, res) => {
    const query =
      "SELECT g.*, c.meal_name, c.meal_img_url, c.day FROM grocery_list AS g LEFT JOIN calendar AS c on g.mealID=c.mealID WHERE g.userID = ?";
    try {
      const [result] = await connectDB
        .promise()
        .execute(query, [req.user_id]);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        error: "Failed to fetch grocery list",
      });
    }
  }
);

// marcar un ítem como completado
//to complete, need id
router.put(
  "/grocery-list/:item_name",
  userMustBeLoggedIn,
  async (req, res) => {
    const item_name = req.params.item_name;
    const { completed } = req.body;
    const completedValue = completed ? 1 : 0;

    try {
      const query = `UPDATE grocery_list SET completed = ? WHERE item_name = ?`;
      const [result] = await connectDB
        .promise()
        .execute(query, [
          completedValue,
          item_name,
        ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error });
      }

      res.status(200).json({
        message:
          "Grocery item updated successfully",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

// delete a meal from the calendar
//to delete from calendar, need mealID
router.delete(
  "/calendar/:id",
  userMustBeLoggedIn,
  async (req, res) => {
    const mealId = req.params.id;

    try {
      const query = `DELETE FROM calendar WHERE mealID = ?`;
      const [result] = await connectDB
        .promise()
        .execute(query, [mealId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error });
      }

      res.status(200).json({
        message: "Meal deleted successfully!",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

// delete an item from the grocery list
//need item_name
router.delete(
  "/grocery-list/:item_name",
  userMustBeLoggedIn,
  async (req, res) => {
    const item_name = req.params.item_name;

    try {
      const query = `DELETE FROM grocery_list WHERE item_name = ?`;
      const [result] = await connectDB
        .promise()
        .execute(query, [item_name]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error });
      }

      res.status(200).json({
        message: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

module.exports = router;
