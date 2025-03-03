import { useEffect, useState, useContext } from "react";
import "./Calendar.css"
import AuthContext from "../context/AuthContext";

const dayOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

const Calendar = ({ mealPlan, onDisplayMeal, onDeleteMeal }) => {
    console.log("Calendar received:", mealPlan);
    const auth = useContext(AuthContext)
/* 
    if (!Array.isArray(mealPlan) || mealPlan.length === 0) {
        return <p>No meals found in calendar</p>;
    }
 */
    // Organize the data
    // const formattedCalendar = {};
    // mealPlan.forEach((entry) => {
    //     if (!formattedCalendar[entry.day]) {
    //         formattedCalendar[entry.day] = {};
    //     }
    //     formattedCalendar[entry.day][entry.meal_type] = entry.meal_name;
    // });

    return (
        <div className="calendar-container">
            <h2>Weekly Meal Plan</h2>
            <table className="calendar-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Breakfast</th>
                        <th>Lunch</th>
                        <th>Dinner</th>
                    </tr>
                </thead>
                <tbody>
                    {dayOfWeek.map((day) => (
                        <tr key={day}>
                            <td className="day-label">{day}</td>
                            {mealTypes.map((meal) => (
                                <td key={`${day}-${meal}`} className="meal-cell">
                                    {mealPlan
                                        .filter(entry => entry.day === day && entry.meal_type === meal)
                                        .map(entry => (
                                            <div key={entry.mealID} onClick={() => onDisplayMeal(entry.mealID)} className="calendar-box" >
                                                <button 
                                                    onClick={(e) => onDeleteMeal(e, entry.mealID)}
                                                    className="calendar-delete-btn"
                                                >
                                                    ·
                                                </button>                                                
                                                <span>{entry.meal_name}</span>

                                                <img src={entry.meal_img_url} alt={entry.meal_name} className="calendar-img"/>
                                            </div>
                                        ))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};    


export default Calendar;
