import * as XLSX from 'xlsx';

// Sample questions data
const sampleQuestions = [
    {
        text: "What is the SI unit of force?",
        subject: "Physics",
        chapter: "Force and Motion",
        topic: "Units",
        type: "MCQ",
        difficulty: "Easy",
        marks: 4,
        negativeMarks: -1,
        optionA: "Newton",
        optionB: "Joule",
        optionC: "Watt",
        optionD: "Pascal",
        correctAnswer: 0,
        explanation: "Force is measured in Newtons (N) in the SI system."
    },
    {
        text: "Calculate the acceleration if force is 10N and mass is 2kg.",
        subject: "Physics",
        chapter: "Force and Motion",
        topic: "Newton's Laws",
        type: "Numerical",
        difficulty: "Medium",
        marks: 4,
        negativeMarks: 0,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: 5,
        explanation: "Using F = ma, a = F/m = 10/2 = 5 m/s²"
    },
    {
        text: "What is the chemical formula for water?",
        subject: "Chemistry",
        chapter: "Basic Concepts",
        topic: "Chemical Formulas",
        type: "MCQ",
        difficulty: "Easy",
        marks: 4,
        negativeMarks: -1,
        optionA: "H2O",
        optionB: "CO2",
        optionC: "NaCl",
        optionD: "CH4",
        correctAnswer: 0,
        explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom."
    },
    {
        text: "If sinθ = 0.5, what is the value of θ in degrees?",
        subject: "Mathematics",
        chapter: "Trigonometry",
        topic: "Basic Trigonometric Ratios",
        type: "Numerical",
        difficulty: "Medium",
        marks: 4,
        negativeMarks: 0,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: 30,
        explanation: "sin(30°) = 0.5, so θ = 30°"
    },
    {
        text: "What is the derivative of x²?",
        subject: "Mathematics",
        chapter: "Calculus",
        topic: "Differentiation",
        type: "MCQ",
        difficulty: "Medium",
        marks: 4,
        negativeMarks: -1,
        optionA: "x",
        optionB: "2x",
        optionC: "2",
        optionD: "x³",
        correctAnswer: 1,
        explanation: "The derivative of x² is 2x."
    }
];

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sampleQuestions);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

// Write to file
XLSX.writeFile(workbook, "sample_questions.xlsx");

console.log("Sample questions Excel file created: sample_questions.xlsx");