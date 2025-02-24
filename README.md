# MVP PROJECT

This is a student project for Codeop's fullstack bootcamp.

This is a web application designed to help users plan their meals for the week and generate a shopping list based on their selections. The goal is to provide an easy to use interface where users can add meals to specific days, track their grocery list, and manage their meal prep efficiently.

The app consists of:

- A weekly meal calendar where users can assign meals to each day.
- A recipe search feature allowing users to find and add meals.
- A grocery list generator that automatically compiles the ingredients needed.
- A database-backed system for meal storage and retrieval.


## Setup 

### Dependencies

Run `npm install` in the project folder to install dependencies related to Express (the server).

`cd client` and run `npm install` install dependencies related to React (the client).

### Database Prep

This project uses MySQL, so make sure you have it installed. Run this command to create the tables: `npm run migrate`.

This will set up two tables:
- calendar (for storing meals)
- grocery_list (for tracking shopping items)


### Run Your Development Servers

- Run `npm start` in project directory to start the Express server on port 3001
- `cd client` and run `npm run dev` to start client server in development mode with hot reloading in port 5173.
- Client is configured so all API calls will be proxied to port 3001 for a smoother development experience.
- You can test your client app in `http://localhost:5173`
- You can test your API in `http://localhost:3001/api`

## API ENDPOINTS

<img src="my-express-app/client/public/api-endpoints.png" alt="API Endpoints"/>

### Thoughts on feature extensions
- Drag-and-Drop Calendar: Allow users to move meals around.
- Nutritional Insights: Show calorie and macro breakdown for meals.
- Grocery List Export: Enable users to download or email their shopping list.
- User Authentication: Save personal meal plans and preferences

#### CREDIT 

Built by: Ikram El Malki Zekalmi.

For: CodeOp Fullstack Bootcamp 