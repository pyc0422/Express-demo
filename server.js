let express = require("express");
let fs = require("fs");
let cors = require("cors");

let app = express();
app.use(cors());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json());

////////////////////////////////////////////////////////////
// API endpoints

// GET all courses
app.get("/api/courses", function (req, res) {
    console.log("LOG: Got a GET request for all courses");

    let data = fs.readFileSync(__dirname + "/data/" + "courses.json", "utf8");
    data = JSON.parse(data);

    // LOG returned data
    console.log("LOG: Returned courses -> ");
    console.log(data);

    res.end(JSON.stringify(data));
});

// GET one course by id
app.get("/api/courses/:id", function (req, res) {
    let id = req.params.id;
    console.log("LOG: Got a GET request for course " + id);

    let data = fs.readFileSync(__dirname + "/data/" + "courses.json", "utf8");
    data = JSON.parse(data);

    // Find the course
    let match = data.find(c => c.id == id);

    // If course not found
    if (match == undefined) {
        console.log("LOG: **NOT FOUND**: course " + id + " does not exist!");
        res.status(404).send();   // not found
        return;
    }

    // LOG returned data
    console.log("LOG: Returned course -> ");
    console.log(match);

    res.end(JSON.stringify(match));
});

// POST a course to be added
app.post("/api/courses", urlencodedParser, function (req, res) {
    console.log("LOG: Got a POST request to add a course");
    console.log("LOG: Message body ->");
    console.log(JSON.stringify(req.body));

    // If not all course data passed, requect the request
    if (req.body.dept || req.body.courseNum || req.body.courseName ||
        req.body.instructor || req.body.startDate || req.body.numDays) {

        console.log("LOG: **MISSING DATA**: one or more course properties missing");
        res.status(400).send();   // can't process due to 1 or more missing properties
        return;
    }

    let data = fs.readFileSync(__dirname + "/data/" + "courses.json", "utf8");
    data = JSON.parse(data);

    // Get the id of this new course
    let nextIdData = fs.readFileSync(__dirname + "/data/" + "next-ids.json", "utf8");
    nextIdData = JSON.parse(nextIdData);

    let nextCourseId = nextIdData.nextCourseId;

    nextIdData.nextCourseId++;
    fs.writeFileSync(__dirname + "/data/" + "next-ids.json", JSON.stringify(nextIdData));

    // Create the course w/ new id 
    let course = {
        id: nextCourseId,
        courseNum: req.body.courseNum,
        courseName: req.body.courseName,
        instructor: req.body.instructor,
        startDate: req.body.startDate,
        numDays: Number(req.body.numDays)
    };

    data.push(course);
    fs.writeFileSync(__dirname + "/data/" + "courses.json", JSON.stringify(course));

    // LOG data for tracing
    console.log("LOG: New course added is -> ");
    console.log(course);

    res.status(201).json(course);
})

/*
app.put("/api/courses/:id", function (req, res) {
   console.log("LOG: Got a PUT request for a course");
   res.status(200).send();
})
 
app.delete("/api/courses/:id", function (req, res) {
   console.log("LOG: Got a DELETE request for a course");
   res.status(200).send();
})
*/

/////////////////////////////////////////////////////
// Start the server

// app.use(express.static("public"));

let server = app.listen(8081, function () {
    let port = server.address().port;
    console.log("LOG: App listening at port %s", port);
});