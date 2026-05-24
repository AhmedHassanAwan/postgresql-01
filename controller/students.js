// import {prisma} from "../lib/prisma.ts";

// // CREATE STUDENT
// export const createUser = async (req, res) => {

//     const { name, email, age } = req.body;

//     try {

//         if (!name || !email || !age) {
//             return res.status(400).json({
//                 error: "All fields are required",
//             });
//         }

//         const student = await prisma.student.create({
//             data: {
//                 name,
//                 email,
//                 age
//             },
//         });

//         res.status(201).json(student);

//     } catch (error) {

//         res.status(500).json({
//             error: error.message,
//         });

//     }
// };


// // GET ALL STUDENTS
// export const getstudents = async (req, res) => {

//     try {

//         const students = await prisma.student.findMany();

//         res.json(students);

//     } catch (error) {

//         res.status(500).json({
//             error: error.message,
//         });

//     }

// };


// // GET SINGLE STUDENT
// export const getStudentById = async (req, res) => {

//     const { id } = req.params;

//     try {

//         const student = await prisma.student.findUnique({
//             where: {
//                 id: Number(id),
//             },
//         });

//         if (!student) {
//             return res.status(404).json({
//                 message: "Student not found",
//             });
//         }

//         res.json(student);

//     } catch (error) {

//         res.status(500).json({
//             error: error.message,
//         });

//     }

// };


import { prisma } from "../lib/prisma.ts";

export const createStudent = async (req, res) => {
    const { name, email, age } = req.body;

    try {
        // Validation
        if (!name || !email || !age) {
            return res.status(400).json({
                success: false,
                message: "All fields are required ",
            });
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

     
        if (isNaN(age) || Number(age) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Age must be a valid positive number",
            });
        }

        const student = await prisma.student.create({
            data: {
                name,
                email,
                age: Number(age),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student,
        });

    } catch (error) {
    
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            return res.status(409).json({
                success: false,
                message: "A student with this email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const getStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: { id: "asc" },
        });

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        // ID must be a valid number
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        const student = await prisma.student.findUnique({
            where: { id: Number(id) },
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${id} not found`,
            });
        }

        return res.status(200).json({
            success: true,
            data: student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    try {
        // ID must be valid
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        // At least one field required
        if (!name && !email && !age) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one field to update (name, email, age)",
            });
        }

        // Email format check (if provided)
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email address",
                });
            }
        }

        // Age check (if provided)
        if (age !== undefined && (isNaN(age) || Number(age) <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Age must be a valid positive number",
            });
        }

        // Check student exists
        const existing = await prisma.student.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${id} not found`,
            });
        }

        const updatedStudent = await prisma.student.update({
            where: { id: Number(id) },
            data: {
                ...(name  && { name }),
                ...(email && { email }),
                ...(age   && { age: Number(age) }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent,
        });

    } catch (error) {
        // Duplicate email on update
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            return res.status(409).json({
                success: false,
                message: "A student with this email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        // ID must be valid
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        // Check student exists
        const existing = await prisma.student.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${id} not found`,
            });
        }

        await prisma.student.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            success: true,
            message: `Student with ID ${id} deleted successfully`,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};