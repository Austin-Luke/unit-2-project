// Austin Berndlmaier's Unit 2 Project -- ACBS Membership Directory -- Light Simulation


// ___________________________________________________________________________________________


// ⬇ ⬇ Import modules below ⬇ ⬇

const dotenv = require("dotenv")
    // requires pkg

dotenv.config()
    // loads environment variables from .env file    

const express = require('express')
    // allows for importation of external modules

const mongoose = require("mongoose")
    // imports mongoose library

const app = express()
    // the express application object; used to define routes, middleware, etc.

const methodOverride = require("method-override")
    // defines http translator middleware 

const morgan = require("morgan")
    // defines logging tool middleware

mongoose.connect(process.env.MONGODB_URI)
    // connects to the database using secret string from .env file

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
    // logs connection status to terminal on start; an event listener

const Member = require("./models/member.js")
    // imports the member model to this file


// ___________________________________________________________________________________________


// ⬇ ⬇ Mounting middleware below ⬇ ⬇

app.use(express.urlencoded({ extended: false }));
    // This middleware parses incoming request bodies, 
    // extracting form data and converting it into a JavaScript object. 
    // It then attaches this object to the req.body property of the request, 
    // making the form data easily accessible within our route handlers.

app.use(methodOverride("_method"))
    // translates the RESTful routing conventions used in this program
    // into HTTP methods that the browser can understand behind the scenes.

// app.use(morgan("dev")) 
    // a logging tool for HTTP requests which provides insights into app behavior
        // hidden now to de-clutter the terminal


// ___________________________________________________________________________________________


// ⬇ ⬇ Routes below ⬇ ⬇

app.get("/", async (req, res) => {
    res.render("index.ejs")
})
    // routes to landing page

app.get("/members", async (req, res) => {
    const allMembers = await Member.find();
    res.render("members/index.ejs", { members: allMembers})
})
    // routes to index page; displays all members

app.get("/members/new", (req, res) => {
    res.render("members/new.ejs")
})
    // presents the 'new member' form to the user

app.get("/members/:memberId", async (req, res) => {
    const foundMember = await Member.findById(req.params.memberId)
    res.render("members/show.ejs", { member: foundMember})
})
    // routes to show page; displays retrieved member data
    
app.post("/members", async (req, res) => {
    if (req.body.currentlyEnrolled === "on") {
    req.body.currentlyEnrolled = true;
    // "on" reflects the user activating the checkbox
    // therefore the boolean value from the schema in member.js is set to "true"

  } else {
    req.body.currentlyEnrolled = false;
    // the default state of the checkbox (deactivated) should always return "false"
  }

  await Member.create(req.body);
    res.redirect("/members")
    // sends the user to the membership index; visual confirmation of their newly added member
})
    
app.delete("/members/:memberId", async (req, res) => {
    await Member.findByIdAndDelete(req.params.memberId)
    res.redirect("/members")
})
    // deletes member; redirects user to the index where the deletion is de-listed

app.get("/members/:memberId/edit", async (req, res) => {
    const foundMember = await Member.findById(req.params.memberId)
    res.render("members/edit.ejs", {
        member: foundMember
    })
})

app.put("/members/:memberId", async (req, res) => {
    if (req.body.currentlyEnrolled === "on") {
        req.body.currentlyEnrolled = true
    } else {
        req.body.currentlyEnrolled = false
    }
        // handles 'currentlyEnrolled' checkbox data

    await Member.findByIdAndUpdate(req.params.memberId, req.body)
        // updates the member in the database

    res.redirect(`/members/${req.params.memberId}`)
        // redirects to the member's show page to see the updates
})
    // handles 'put' requests sent from the 'edit' form on the 'edit' page

    
// ___________________________________________________________________________________________


app.listen(3000, () => {
  console.log('Listening on port 3000')
});
    // listen live in the terminal
