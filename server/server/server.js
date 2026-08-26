const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("../models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Hello
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend is running successfully"
    });
});

// API GET danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});

// API POST thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Error creating student",
            error: error.message
        });
    }
});

// API PUT cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: "Error updating student",
            error: error.message
        });
    }
});

// API DELETE xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully",
            student: student
        });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });