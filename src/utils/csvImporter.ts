import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// ========== TYPES ==========

export interface ChapterCSVRow {
    name: string;
    subject: string;
    unit: string;
    description: string;
    topics: string;
    difficulty: string;
    status: string;
}

export interface QuestionCSVRow {
    text: string;
    textHindi?: string;
    subject: string;
    chapter: string;
    topic: string;
    type: string;
    difficulty: string;
    marks: string;
    negativeMarks: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionHindiA?: string;
    optionHindiB?: string;
    optionHindiC?: string;
    optionHindiD?: string;
    correctAnswer: string;
    explanation: string;
    examCategory?: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    isDuplicate?: boolean; // New flag for duplicates
}

export interface ParsedData<T> {
    data: T[];
    errors: any[];
}
const isExcelFile = (file: File): boolean => /\.(xlsx|xls)$/i.test(file.name);

const parseExcelFile = async <T>(file: File): Promise<ParsedData<T>> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get raw data
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as any[];
        
        // Normalize headers for each row
        const normalizedData = rawData.map(row => {
            const normalizedRow: any = {};
            Object.keys(row).forEach(key => {
                const k = key.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
                
                // Map common variations to exact interface keys
                let targetKey = k;
                if (k === 'question' || k === 'questiontext' || k === 'text') targetKey = 'text';
                if (k === 'texthindi' || k === 'questionhindi' || k === 'hindi' || k === 'hinditext') targetKey = 'textHindi';
                if (k === 'subject' || k === 'sub' || k === 'subjectname' || k === 'category') targetKey = 'subject';
                if (k === 'chapter' || k === 'chap' || k === 'chaptername' || k === 'unit') targetKey = 'chapter';
                if (k === 'topic' || k === 'topicname') targetKey = 'topic';
                if (k === 'type' || k === 'questiontype') targetKey = 'type';
                if (k === 'difficulty' || k === 'level') targetKey = 'difficulty';
                if (k === 'marks' || k === 'score') targetKey = 'marks';
                if (k === 'negativemark' || k === 'negativemarking') targetKey = 'negativeMarks';
                if (k === 'optiona' || k === 'a' || k === 'opt1' || k === 'option1' || k === 'choice1' || k === '1') targetKey = 'optionA';
                if (k === 'optionb' || k === 'b' || k === 'opt2' || k === 'option2' || k === 'choice2' || k === '2') targetKey = 'optionB';
                if (k === 'optionc' || k === 'c' || k === 'opt3' || k === 'option3' || k === 'choice3' || k === '3') targetKey = 'optionC';
                if (k === 'optiond' || k === 'd' || k === 'opt4' || k === 'option4' || k === 'choice4' || k === '4') targetKey = 'optionD';
                if (k === 'optionhindia') targetKey = 'optionHindiA';
                if (k === 'optionhindib') targetKey = 'optionHindiB';
                if (k === 'optionhindic') targetKey = 'optionHindiC';
                if (k === 'optionhindid') targetKey = 'optionHindiD';
                if (k === 'ans' || k === 'answer' || k === 'correctans' || k === 'correctanswer' || k === 'key') targetKey = 'correctAnswer';
                if (k === 'explanation' || k === 'solution' || k === 'sol') targetKey = 'explanation';
                if (k === 'exam' || k === 'examcategory' || k === 'examname') targetKey = 'examCategory';
                
                normalizedRow[targetKey] = row[key];
            });

            // Auto-detect subject from file name if missing in row
            if (!normalizedRow.subject || normalizedRow.subject === '') {
                const fileName = file.name.toLowerCase();
                if (fileName.includes('physics')) normalizedRow.subject = 'Physics';
                else if (fileName.includes('chemistry')) normalizedRow.subject = 'Chemistry';
                else if (fileName.includes('math')) normalizedRow.subject = 'Mathematics';
                else if (fileName.includes('accountancy') || fileName.includes('accounts')) normalizedRow.subject = 'Accountancy';
            }

            // Default values if missing
            if (!normalizedRow.chapter || normalizedRow.chapter === '') normalizedRow.chapter = 'General';
            if (!normalizedRow.topic || normalizedRow.topic === '') normalizedRow.topic = 'General';
            if (!normalizedRow.type) normalizedRow.type = 'MCQ';
            if (!normalizedRow.difficulty) normalizedRow.difficulty = 'Medium';
            if (!normalizedRow.marks) normalizedRow.marks = '4';
            if (!normalizedRow.negativeMarks) normalizedRow.negativeMarks = normalizedRow.type === 'MCQ' ? '-1' : '0';

            // Answer intelligence: Convert A,B,C,D or 1,2,3,4 to 0,1,2,3
            if (normalizedRow.correctAnswer !== undefined && normalizedRow.correctAnswer !== null) {
                const ans = normalizedRow.correctAnswer.toString().toUpperCase().trim();
                if (ans === 'A' || ans === '1') normalizedRow.correctAnswer = '0';
                else if (ans === 'B' || ans === '2') normalizedRow.correctAnswer = '1';
                else if (ans === 'C' || ans === '3') normalizedRow.correctAnswer = '2';
                else if (ans === 'D' || ans === '4') normalizedRow.correctAnswer = '3';
            }

            return normalizedRow as T;
        });

        return {
            data: normalizedData,
            errors: []
        };
    } catch (error) {
        return {
            data: [],
            errors: [error]
        };
    }
};
// ========== CSV PARSERS ==========

export const parseChaptersCSV = async (file: File): Promise<ParsedData<ChapterCSVRow>> => {
    if (isExcelFile(file)) {
        return parseExcelFile<ChapterCSVRow>(file);
    }

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve({
                    data: results.data as ChapterCSVRow[],
                    errors: results.errors
                });
            },
            error: (error) => reject(error)
        });
    });
};

export const parseQuestionsCSV = async (file: File): Promise<ParsedData<QuestionCSVRow>> => {
    if (isExcelFile(file)) {
        return parseExcelFile<QuestionCSVRow>(file);
    }

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve({
                    data: results.data as QuestionCSVRow[],
                    errors: results.errors
                });
            },
            error: (error) => reject(error)
        });
    });
};

// ========== VALIDATORS ==========

export const validateChapter = async (row: ChapterCSVRow, index: number): Promise<ValidationResult> => {
    const errors: string[] = [];

    // Required fields
    if (!row.name || row.name.trim() === '') {
        errors.push(`Row ${index + 1}: Chapter name is required`);
    }

    if (!row.subject || row.subject.trim() === '') {
        errors.push(`Row ${index + 1}: Subject is required`);
    } else if (!['Physics', 'Chemistry', 'Mathematics', 'Accountancy'].includes(row.subject)) {
        errors.push(`Row ${index + 1}: Subject must be Physics, Chemistry, Mathematics, or Accountancy`);
    }

    if (!row.description || row.description.trim() === '') {
        errors.push(`Row ${index + 1}: Description is required`);
    }

    if (!row.topics || row.topics.trim() === '') {
        errors.push(`Row ${index + 1}: Topics are required`);
    }

    // Optional fields with validation
    if (row.difficulty && !['Easy', 'Medium', 'Hard'].includes(row.difficulty)) {
        errors.push(`Row ${index + 1}: Difficulty must be Easy, Medium, or Hard`);
    }

    if (row.status && !['active', 'draft', 'archived'].includes(row.status)) {
        errors.push(`Row ${index + 1}: Status must be active, draft, or archived`);
    }

    // Check for duplicates if basic validation passed
    let isDuplicate = false;
    if (errors.length === 0 && row.name && row.subject) {
        try {
            const duplicateQuery = query(
                collection(db, 'chapters'),
                where('name', '==', row.name.trim()),
                where('subject', '==', row.subject.trim())
            );
            const snapshot = await getDocs(duplicateQuery);
            if (!snapshot.empty) {
                isDuplicate = true;
                errors.push(`Row ${index + 1}: Duplicate - Chapter "${row.name}" already exists for ${row.subject}`);
            }
        } catch (error) {
            console.error('Error checking for duplicates:', error);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        isDuplicate
    };
};

export const validateQuestion = async (row: QuestionCSVRow, index: number): Promise<ValidationResult> => {
    const errors: string[] = [];

    // Diagnostic info: what keys did we actually find?
    const foundKeys = Object.keys(row).filter(k => row[k] !== undefined && row[k] !== '');
    const diagnosticInfo = ` [Detected columns: ${foundKeys.join(', ')}]`;

    // Aggressive Fallback for Question Text
    if (!row.text || row.text.trim() === '') {
        // Try to find ANY column that looks like a question (ends with ? or is long)
        const possibleQuestionKey = Object.keys(row).find(k => {
            const val = row[k]?.toString() || '';
            return val.includes('?') || val.length > 30;
        });
        if (possibleQuestionKey) {
            row.text = row[possibleQuestionKey].toString();
        } else {
            errors.push(`Row ${index + 1}: Question text is required.${diagnosticInfo}`);
        }
    }

    if (!row.subject || !['Physics', 'Chemistry', 'Mathematics', 'Accountancy'].includes(row.subject)) {
        errors.push(`Row ${index + 1}: Valid subject is required (Physics/Chemistry/Mathematics/Accountancy)`);
    }

    // Chapter and Topic are now optional (auto-filled with 'General' if missing)

    if (!row.type || !['MCQ', 'Numerical'].includes(row.type)) {
        errors.push(`Row ${index + 1}: Type must be MCQ or Numerical`);
    }

    if (!row.difficulty || !['Easy', 'Medium', 'Hard'].includes(row.difficulty)) {
        errors.push(`Row ${index + 1}: Difficulty must be Easy, Medium, or Hard`);
    }

    if (!row.marks || isNaN(Number(row.marks)) || Number(row.marks) <= 0) {
        errors.push(`Row ${index + 1}: Marks must be a positive number`);
    }

    if (row.examCategory && !['JEE', 'NEET', 'SSC', 'Boards', 'Other'].includes(row.examCategory)) {
        errors.push(`Row ${index + 1}: examCategory must be JEE, NEET, SSC, Boards, or Other`);
    }

    // Type-specific validation
    if (row.type === 'MCQ') {
        if (!row.optionA || !row.optionB || !row.optionC || !row.optionD) {
            errors.push(`Row ${index + 1}: MCQ questions must have all 4 options`);
        }

        const correctAns = Number(row.correctAnswer);
        if (isNaN(correctAns) || correctAns < 0 || correctAns > 3) {
            errors.push(`Row ${index + 1}: MCQ correctAnswer must be 0, 1, 2, or 3`);
        }
    }

    if (row.type === 'Numerical') {
        if (isNaN(Number(row.correctAnswer))) {
            errors.push(`Row ${index + 1}: Numerical correctAnswer must be a number`);
        }
    }

    // Verify chapter exists (if no other errors so far)
    // TEMPORARILY DISABLED: Allow importing questions without strict chapter/topic pre-existence
    /*
    if (errors.length === 0 && row.chapter && row.subject) {
        try {
            const chaptersQuery = query(
                collection(db, 'chapters'),
                where('name', '==', row.chapter),
                where('subject', '==', row.subject)
            );
            const snapshot = await getDocs(chaptersQuery);

            if (snapshot.empty) {
                errors.push(`Row ${index + 1}: Chapter "${row.chapter}" not found for subject ${row.subject}`);
            } else {
                // Verify topic exists in chapter
                const chapterData = snapshot.docs[0].data();
                const topics = chapterData.topics || [];
                if (!topics.includes(row.topic)) {
                    errors.push(`Row ${index + 1}: Topic "${row.topic}" not found in chapter "${row.chapter}"`);
                }
            }
        } catch (error) {
            errors.push(`Row ${index + 1}: Error verifying chapter existence`);
        }
    }
    */

    // Check for duplicate questions
    // TEMPORARILY DISABLED: Allow importing duplicated questions
    let isDuplicate = false;
    /*
    if (errors.length === 0 && row.text && row.subject) {
        try {
            const duplicateQuery = query(
                collection(db, 'questions'),
                where('text', '==', row.text.trim()),
                where('subject', '==', row.subject.trim())
            );
            const snapshot = await getDocs(duplicateQuery);
            if (!snapshot.empty) {
                isDuplicate = true;
                errors.push(`Row ${index + 1}: Duplicate - Question already exists`);
            }
        } catch (error) {
            console.error('Error checking for duplicate questions:', error);
        }
    }
    */

    return {
        valid: errors.length === 0,
        errors,
        isDuplicate
    };
};

// ========== BATCH UPLOADERS ==========

export const batchUploadChapters = async (
    rows: ChapterCSVRow[],
    onProgress: (progress: number, current: number, total: number) => void
): Promise<{ success: number; failed: number; skipped: number }> => {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
        try {
            // Check if already exists before uploading
            const duplicateQuery = query(
                collection(db, 'chapters'),
                where('name', '==', rows[i].name.trim()),
                where('subject', '==', rows[i].subject.trim())
            );
            const snapshot = await getDocs(duplicateQuery);

            if (!snapshot.empty) {
                console.log(`Skipping duplicate chapter: ${rows[i].name}`);
                skipped++;
            } else {
                const chapterData = {
                    name: rows[i].name.trim(),
                    subject: rows[i].subject.trim(),
                    unit: rows[i].unit?.trim() || '',
                    description: rows[i].description.trim(),
                    topics: rows[i].topics.split('|').map(t => t.trim()).filter(t => t),
                    difficulty: rows[i].difficulty?.trim() || 'Medium',
                    status: rows[i].status?.trim() || 'active',
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, 'chapters'), chapterData);
                success++;
            }
        } catch (error) {
            console.error(`Error uploading chapter ${rows[i].name}:`, error);
            failed++;
        }

        onProgress(((i + 1) / rows.length) * 100, i + 1, rows.length);
    }

    return { success, failed, skipped };
};

export const batchUploadQuestions = async (
    rows: QuestionCSVRow[],
    onProgress: (progress: number, current: number, total: number) => void
): Promise<{ success: number; failed: number; skipped: number }> => {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
        try {
            // Check if already exists before uploading
            // TEMPORARILY DISABLED: Allow duplicate question imports
            /*
            const duplicateQuery = query(
                collection(db, 'questions'),
                where('text', '==', rows[i].text.trim()),
                where('subject', '==', rows[i].subject.trim())
            );
            const snapshot = await getDocs(duplicateQuery);

            if (!snapshot.empty) {
                console.log(`Skipping duplicate question`);
                skipped++;
            } else {
            */
            // Ensure this block always executes since duplicate check is disabled
            if (true) {
                const text = String(rows[i].text ?? '').trim();
                const textHindi = String(rows[i].textHindi ?? '').trim();
                const subject = String(rows[i].subject ?? '').trim();
                const chapter = String(rows[i].chapter ?? '').trim();
                const topic = String(rows[i].topic ?? '').trim();
                const type = String(rows[i].type ?? '').trim();
                const difficulty = String(rows[i].difficulty ?? '').trim();
                const explanation = String(rows[i].explanation ?? '').trim();
                const examCategory = String(rows[i].examCategory ?? 'JEE').trim();

                const questionData: any = {
                    text,
                    textHindi,
                    subject,
                    chapter,
                    topic,
                    type,
                    difficulty,
                    marks: Number(rows[i].marks),
                    negativeMarks: rows[i].negativeMarks != null && rows[i].negativeMarks !== '' ? Number(rows[i].negativeMarks) : (type === 'MCQ' ? -1 : 0),
                    explanation,
                    examCategory,
                    createdAt: serverTimestamp()
                };

                if (type === 'MCQ') {
                    questionData.options = [
                        String(rows[i].optionA).trim(),
                        String(rows[i].optionB).trim(),
                        String(rows[i].optionC).trim(),
                        String(rows[i].optionD).trim()
                    ];
                    questionData.optionsHindi = [
                        String(rows[i].optionHindiA ?? '').trim(),
                        String(rows[i].optionHindiB ?? '').trim(),
                        String(rows[i].optionHindiC ?? '').trim(),
                        String(rows[i].optionHindiD ?? '').trim()
                    ];
                    questionData.correctAnswer = Number(rows[i].correctAnswer);
                } else {
                    questionData.options = [];
                    questionData.optionsHindi = [];
                    questionData.correctAnswer = String(rows[i].correctAnswer).trim();
                }

                await addDoc(collection(db, 'questions'), questionData);
                success++;
            }
        } catch (error) {
            console.error(`Error uploading question:`, error);
            failed++;
        }

        onProgress(((i + 1) / rows.length) * 100, i + 1, rows.length);
    }

    return { success, failed, skipped };
};

// ========== DOWNLOAD TEMPLATE ==========

export const downloadTemplate = (type: 'chapters' | 'questions') => {
    const url = `/templates/${type}_template.csv`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
