// import express from "express";

// import {createUser,getstudents,getStudentById } from  "../controller/students.js";


// const router = express.Router();

// router.post('/students', createUser);
// router.get('/students', getstudents);
// router.get('/students/:id', getStudentById);


// export default router;



import express from "express";

import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from "../controller/students.js";

const router = express.Router();

router.post("/students", createStudent);

router.get("/students", getStudents);

router.get("/students/:id", getStudentById);

router.put("/students/:id", updateStudent);

router.delete("/students/:id", deleteStudent);

export default router;