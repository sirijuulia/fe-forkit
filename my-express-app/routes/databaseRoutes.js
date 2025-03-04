const express = require("express");
const router = express.Router();
const connectDB = require("../model/database"); // Importa la conexión
const axios = require("axios");

const userMustBeLoggedIn = require("../guards/userMustBeLoggedIn");

// guardar una comida en el calendario
//to add to meals, need userID, day, meal_type, meal_name & meal_img_url
router.post(
  "/meals",
  userMustBeLoggedIn,
  async (req, res) => {
    const {
      day,
      dbID,
      meal_type,
      meal_name,
      meal_img_url,
    } = req.body;

    try {
      const putQuery = `
            INSERT INTO meals (userID, day, dbID, meal_type, meal_name, meal_img_url) 
            VALUES (?, ?, ?, ?, ?, ?)`;
      const getQuery =
        "SELECT * FROM meals WHERE userID = ? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), FIELD(meal_type, 'Breakfast', 'Lunch', 'Dinner')";

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
      const [updatedMeals] = await connectDB
        .promise()
        .execute(getQuery, [req.user_id]);
      Promise.all([result, updatedMeals]).then(
        (values) =>
          res.status(200).send({
            result: values[0],
            updatedMeals: values[1],
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
  "/meals",
  userMustBeLoggedIn,
  async (req, res) => {
    const query =
      "SELECT * FROM meals WHERE userID = ? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), FIELD(meal_type, 'Breakfast', 'Lunch', 'Dinner')";
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

//get specific meal data
router.get(
  "/meals/:id",
  userMustBeLoggedIn,
  async (req, res) => {
    const mealID = req.params.id;
    const query =
      "SELECT * FROM meals WHERE mealID = ?";
    try {
      const [result] = await connectDB
        .promise()
        .execute(query, [req.params.id]);
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
    const { item_name, quantity, mealID } =
      req.body;
    const name_lowercase =
      item_name.toLowerCase();
    try {
      const query = `
            INSERT INTO grocery_list (item_name, quantity, mealID, completed, hide) 
            VALUES (?,  ?, ?, false, false)
        `;

      await connectDB
        .promise()
        .execute(query, [
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

router.post(
  "/instructions",
  userMustBeLoggedIn,
  async (req, res) => {
    const { step, instruction_text, mealID } =
      req.body;
    try {
      const query = `
            INSERT INTO instructions (step, instruction_text, mealID) 
            VALUES (?, ?, ?)
        `;

      await connectDB
        .promise()
        .execute(query, [
          step,
          instruction_text,
          mealID,
        ]);
      res.status(200).json({
        message: "Instruction saved",
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
      "SELECT g.*, m.meal_name, m.meal_img_url, m.day FROM grocery_list AS g LEFT JOIN meals AS m on g.mealID=m.mealID WHERE m.userID = ?";
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

// obtener la lista de compras
router.get(
  "/instructions",
  userMustBeLoggedIn,
  async (req, res) => {
    const query =
      "SELECT i.*, m.meal_name, m.meal_img_url, m.day FROM instructions AS i LEFT JOIN meals AS m on i.mealID=c.mealID WHERE m.userID = ?";
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

//get specific meal data
router.get(
  "/grocery-list/:id",
  userMustBeLoggedIn,
  async (req, res) => {
    const mealID = req.params.id;
    const query =
      "SELECT * FROM grocery_list WHERE mealID = ?";
    try {
      const [result] = await connectDB
        .promise()
        .execute(query, [mealID]);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

router.get(
  "/instructions/:id",
  userMustBeLoggedIn,
  async (req, res) => {
    const mealID = req.params.id;
    const query =
      "SELECT * FROM instructions WHERE mealID = ?";
    try {
      const [result] = await connectDB
        .promise()
        .execute(query, [mealID]);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

// marcar un ítem como completado
//to update, need row, value (&id)
router.put(
  "/grocery-list/:item_name",
  userMustBeLoggedIn,
  async (req, res) => {
    const item_name = req.params.item_name;
    const { row, value } = req.body;
    const updatedValue = value ? 1 : 0;

    try {
      const query = `UPDATE grocery_list SET ${row} = ? WHERE item_name = ?`;
      const [result] = await connectDB
        .promise()
        .execute(query, [
          updatedValue,
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

router.put(
  "/grocery-list",
  userMustBeLoggedIn,
  async (req, res) => {
    const { row, value } = req.body;
    const updatedValue = value ? 1 : 0;

    try {
      const query = `UPDATE grocery_list SET ${row} = ?`;
      const [result] = await connectDB
        .promise()
        .execute(query, [updatedValue]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error });
      }

      res.status(200).json({
        message:
          "Grocery list updated successfully",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error });
    }
  }
);

// delete a meal from the calendar
//to delete from meals, need mealID
router.delete(
  "/meals/:id",
  userMustBeLoggedIn,
  async (req, res) => {
    const mealId = req.params.id;

    try {
      const query = `DELETE FROM meals WHERE mealID = ?`;
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
