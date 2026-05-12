import XLSX from 'xlsx';
import fs from 'fs';

const files = [
    'questions/Class10_Physics_MCQs.xlsx',
    'questions/Class10_Maths_MCQs.xlsx',
    'questions/Class10_Chemistry_MCQs.xlsx'
];

const allQuestions = [];

files.forEach(file => {
    try {
        const workbook = XLSX.readFile(file);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header
        const questions = jsonData.slice(1).map(row => ({
            text: row[0],
            subject: file.includes('Physics') ? 'Physics' : file.includes('Maths') ? 'Mathematics' : 'Chemistry',
            chapter: 'General', // Placeholder
            topic: 'General', // Placeholder
            type: 'MCQ',
            difficulty: row[6] || 'Easy',
            marks: 4,
            negativeMarks: -1,
            optionA: row[1],
            optionB: row[2],
            optionC: row[3],
            optionD: row[4],
            correctAnswer: row[5] === 'A' ? 0 : row[5] === 'B' ? 1 : row[5] === 'C' ? 2 : 3,
            explanation: ''
        }));
        
        allQuestions.push(...questions);
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

// Remove duplicates
const uniqueQuestions = allQuestions.filter((q, index, self) => 
    index === self.findIndex(q2 => q2.text === q.text && q2.subject === q.subject)
);

console.log(JSON.stringify(uniqueQuestions.slice(0, 50), null, 2)); // First 50 for preview

// Write to file
fs.writeFileSync('class10_questions.json', JSON.stringify(uniqueQuestions, null, 2));