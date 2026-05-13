import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, X, Save, Loader2, Download, BarChart3, Edit2, Upload, AlertTriangle } from 'lucide-react';
import { db } from '../../firebase';
import { useSubjectList } from '../../hooks/useSubjectList';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';

import { parseQuestionsCSV, validateQuestion, batchUploadQuestions, downloadTemplate } from '../../utils/csvImporter';
import { JEE_MAINS_2024_WEIGHTAGE } from '../../data/jeeMainsWeightage2024';
import type { QuestionCSVRow, ValidationResult } from '../../utils/csvImporter';

interface Question {
    id: string;
    text: string;
    textHindi?: string;
    options: string[]; // For MCQ, empty for numerical
    optionsHindi?: string[];
    correctAnswer: number | string; // index for MCQ, value for numerical
    subject: string;
    chapter: string; // Chapter name
    topic?: string; // Topic from selected chapter
    examCategory?: string;
    type: 'MCQ' | 'Numerical';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    marks?: number; // Default marks for this question (default: 4)
    negativeMarks?: number; // Negative marking (optional, default: -1 for MCQ)
    explanation?: string; // Solution/explanation text (optional)
    imageUrls?: string[];
    createdAt: any;
}

const AdminQuestionBank = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [chapters, setChapters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const [searchTerm, setSearchTerm] = useState('');
    const [showStats, setShowStats] = useState(false);

    // Deletion Modal State
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeletingLoading, setIsDeletingLoading] = useState(false);

    // Filters
    const [filterSubject, setFilterSubject] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
    const [filterExam, setFilterExam] = useState<string>('all');

    // CSV Import states
    const [isImporting, setIsImporting] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [parsedRows, setParsedRows] = useState<QuestionCSVRow[]>([]);
    const [validationResults, setValidationResults] = useState<Map<number, ValidationResult>>(new Map());
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [importView, setImportView] = useState<'table' | 'mcq'>('table');
    const subjects = useSubjectList();



    const [formData, setFormData] = useState({
        text: '',
        textHindi: '',
        options: ['', '', '', ''],
        optionsHindi: ['', '', '', ''],
        correctAnswer: '0',
        subject: 'Physics',
        chapter: '',
        topic: '',
        examCategory: 'JEE',
        type: 'MCQ' as 'MCQ' | 'Numerical',
        difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
        marks: 4,
        negativeMarks: -1,
        explanation: '',

    });

    // Get chapters for selected subject from chapters collection
    const getChaptersForSubject = (subject: string) => {
        return chapters.filter(ch => ch.subject === subject);
    };

    // Get topics from selected chapter
    const getTopicsForChapter = (chapterName: string) => {
        const chapter = chapters.find(ch => ch.name === chapterName);
        return chapter?.topics || [];
    };

    useEffect(() => {
        // Fetch questions
        const questionsQuery = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
        const unsubscribeQuestions = onSnapshot(questionsQuery, (snapshot) => {
            const fetchedQuestions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Question[];
            setQuestions(fetchedQuestions);
            setIsLoading(false);
        });

        // Fetch chapters for dynamic chapter and topic loading
        const chaptersQuery = query(collection(db, 'chapters'), orderBy('createdAt', 'desc'));
        const unsubscribeChapters = onSnapshot(chaptersQuery, (snapshot) => {
            const fetchedChapters = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChapters(fetchedChapters);
        });

        return () => {
            unsubscribeQuestions();
            unsubscribeChapters();
        };
    }, []);





    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await delay(1000); // Artificial delay



            const questionData: any = {
                text: formData.text,
                textHindi: formData.textHindi || '',
                subject: formData.subject,
                chapter: formData.chapter,
                topic: formData.topic || '',
                examCategory: formData.examCategory || 'General',
                type: formData.type,
                difficulty: formData.difficulty,
                marks: formData.marks,
                negativeMarks: formData.type === 'MCQ' ? formData.negativeMarks : 0,
                explanation: formData.explanation || '',
                createdAt: serverTimestamp()
            };

            if (formData.type === 'MCQ') {
                questionData.options = formData.options.filter(o => o.trim() !== '');
                questionData.optionsHindi = formData.optionsHindi;
                questionData.correctAnswer = Number(formData.correctAnswer);
            } else {
                questionData.options = [];
                questionData.optionsHindi = formData.optionsHindi;
                questionData.correctAnswer = formData.correctAnswer;
            }

            await addDoc(collection(db, 'questions'), questionData);

            setIsCreating(false);
            setFormData({
                text: '',
                textHindi: '',
                options: ['', '', '', ''],
                optionsHindi: ['', '', '', ''],
                correctAnswer: '0',
                subject: 'Physics',
                chapter: '',
                topic: '',
                examCategory: 'JEE',
                type: 'MCQ',
                difficulty: 'Medium',
                marks: 4,
                negativeMarks: -1,
                explanation: ''
            });
        } catch (error) {
            console.error("Error creating question:", error);
            alert("Error creating question. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeletingLoading(true);
        try {
            await delay(1000); // Artificial delay
            await deleteDoc(doc(db, 'questions', id));
            setConfirmDeleteId(null);
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Failed to delete question. Please try again.");
        } finally {
            setIsDeletingLoading(false);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleOptionHindiChange = (index: number, value: string) => {
        const newOptionsHindi = [...formData.optionsHindi];
        newOptionsHindi[index] = value;
        setFormData({ ...formData, optionsHindi: newOptionsHindi });
    };



    const handleEdit = (question: Question) => {
        setEditingQuestion(question);
        setFormData({
            text: question.text,
            textHindi: question.textHindi || '',
            options: question.options.length > 0 ? question.options : ['', '', '', ''],
            optionsHindi: question.optionsHindi?.length === 4 ? question.optionsHindi : ['', '', '', ''],
            correctAnswer: typeof question.correctAnswer === 'number' ? String(question.correctAnswer) : question.correctAnswer,
            subject: question.subject,
            chapter: question.chapter,
            topic: question.topic || '',
            examCategory: question.examCategory || 'JEE',
            type: question.type,
            difficulty: question.difficulty,
            marks: question.marks || 4,
            negativeMarks: question.negativeMarks || -1,
            explanation: question.explanation || '',
        });
        setIsEditing(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuestion) return;

        setIsSubmitting(true);
        try {
            await delay(1000); // Artificial delay



            const questionData: any = {
                text: formData.text,
                textHindi: formData.textHindi || '',
                subject: formData.subject,
                chapter: formData.chapter,
                topic: formData.topic || '',
                examCategory: formData.examCategory || 'General',
                type: formData.type,
                difficulty: formData.difficulty,
                marks: formData.marks,
                negativeMarks: formData.type === 'MCQ' ? formData.negativeMarks : 0,
                explanation: formData.explanation || ''
            };

            if (formData.type === 'MCQ') {
                questionData.options = formData.options.filter(o => o.trim() !== '');
                questionData.optionsHindi = formData.optionsHindi;
                questionData.correctAnswer = Number(formData.correctAnswer);
            } else {
                questionData.options = [];
                questionData.optionsHindi = formData.optionsHindi;
                questionData.correctAnswer = formData.correctAnswer;
            }

            await updateDoc(doc(db, 'questions', editingQuestion.id), questionData);

            setIsEditing(false);
            setEditingQuestion(null);
            setFormData({
                text: '',
                textHindi: '',
                options: ['', '', '', ''],
                optionsHindi: ['', '', '', ''],
                correctAnswer: '0',
                subject: 'Physics',
                chapter: '',
                topic: '',
                examCategory: 'JEE',
                type: 'MCQ',
                difficulty: 'Medium',
                marks: 4,
                negativeMarks: -1,
                explanation: ''
            });
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Error updating question. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========== CSV IMPORT HANDLERS ==========

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportFile(file);

        try {
            const result = await parseQuestionsCSV(file);
            setParsedRows(result.data);

            // Validate all rows
            const validations = new Map<number, ValidationResult>();
            for (let i = 0; i < result.data.length; i++) {
                const validation = await validateQuestion(result.data[i], i);
                validations.set(i, validation);
            }
            setValidationResults(validations);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file. Please check the format.');
        }
    };

    const handleImportCSV = async () => {
        const validRows = parsedRows.filter((_, index) => {
            const validation = validationResults.get(index);
            return validation?.valid;
        });

        if (validRows.length === 0) {
            alert('No valid rows to import');
            return;
        }

        if (!window.confirm(`Import ${validRows.length} questions?`)) {
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const result = await batchUploadQuestions(validRows, (progress) => {
                setUploadProgress(progress);
            });

            alert(`Import complete!\nSuccessfully imported: ${result.success}\nSkipped (duplicates): ${result.skipped}\nFailed: ${result.failed}`);

            // Reset import state
            setIsImporting(false);
            setImportFile(null);
            setParsedRows([]);
            setValidationResults(new Map());
            setUploadProgress(0);
        } catch (error) {
            console.error('Error importing questions:', error);
            alert('Error importing questions. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Apply filters
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.chapter.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
        const matchesType = filterType === 'all' || q.type === filterType;
        const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
        const matchesExam = filterExam === 'all' || q.examCategory === filterExam;

        return matchesSearch && matchesSubject && matchesType && matchesDifficulty && matchesExam;
    });

    // Calculate statistics
    const getStatistics = () => {
        const stats = {
            total: questions.length,
            bySubject: {} as Record<string, number>,
            byType: { MCQ: 0, Numerical: 0 },
            byDifficulty: { Easy: 0, Medium: 0, Hard: 0 }
        };

        questions.forEach(q => {
            stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
            stats.byType[q.type]++;
            stats.byDifficulty[q.difficulty]++;
        });

        return stats;
    };

    const stats = getStatistics();

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto space-y-6 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800">Question Bank</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage questions for test generation.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => downloadTemplate('questions')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                    >
                        <Download size={16} /> Download Template
                    </button>
                    <button
                        onClick={() => setIsImporting(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                    >
                        <Upload size={16} /> Import CSV/XLSX
                    </button>
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                    >
                        <BarChart3 size={16} /> Statistics
                    </button>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
                    >
                        <Plus size={16} /> Add Question
                    </button>
                </div>
            </div>

            {/* Statistics Panel */}
            {showStats && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-md p-4 border border-slate-200"
                >
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">Question Bank Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        <div className="bg-white rounded border border-slate-100 p-3 text-center">
                            <div className="text-lg font-semibold text-slate-800">{stats.total}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Total Questions</div>
                        </div>
                        <div className="bg-white rounded border border-slate-100 p-3 text-center">
                            <div className="text-lg font-semibold text-slate-800">{stats.bySubject['Physics'] || 0}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Physics</div>
                        </div>
                        <div className="bg-white rounded border border-slate-100 p-3 text-center">
                            <div className="text-lg font-semibold text-slate-800">{stats.bySubject['Chemistry'] || 0}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Chemistry</div>
                        </div>
                        <div className="bg-white rounded border border-slate-100 p-3 text-center">
                            <div className="text-lg font-semibold text-slate-800">{stats.bySubject['Mathematics'] || 0}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Mathematics</div>
                        </div>
                        <div className="bg-white rounded border border-slate-100 p-3 text-center">
                            <div className="text-lg font-semibold text-slate-800">{stats.bySubject['Accountancy'] || 0}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Accountancy</div>
                        </div>
                        <div className="bg-white rounded border border-slate-100 p-3 text-center">
                            <div className="text-sm font-semibold text-slate-800 mt-1">{stats.byType.MCQ} / {stats.byType.Numerical}</div>
                            <div className="text-xs text-slate-500 mt-0.5">MCQ / Numerical</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-md border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-2 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 bg-white"
                    >
                        <option value="all">All Subjects</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Accountancy">Accountancy</option>
                    </select>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 bg-white"
                    >
                        <option value="all">All Types</option>
                        <option value="MCQ">MCQ</option>
                        <option value="Numerical">Numerical</option>
                    </select>
                    <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 bg-white"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Question</th>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Chapter</th>
                                <th className="px-4 py-3">Topic</th>
                                <th className="px-4 py-3">Exam</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Marks</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={8} className="text-center py-6"><Loader2 className="animate-spin inline" size={20} /></td></tr>
                            ) : filteredQuestions.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-6 text-slate-500">No questions found. Add some to get started.</td></tr>
                            ) : (
                                filteredQuestions.map((q) => (
                                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-700 max-w-md truncate">
                                            {q.text}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium text-slate-600`}>
                                                {q.subject}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{q.chapter}</td>
                                        <td className="px-4 py-3 text-slate-600">{q.topic || '-'}</td>
                                        <td className="px-4 py-3 text-slate-600">{q.examCategory || 'General'}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {q.type}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{q.marks || 4}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(q)}
                                                    className="text-slate-400 hover:text-teal-600 transition-colors"
                                                    title="Edit question"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(q.id)}
                                                    className="text-slate-400 hover:text-red-600 transition-colors"
                                                    title="Delete question"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsCreating(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-slate-800">Add New Question</h2>
                                <button onClick={() => setIsCreating(false)}><X size={24} className="text-slate-400" /></button>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                {/* Subject and Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Subject *</label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value as any, chapter: '', topic: '' })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            {subjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Question Type *</label>
                                        <select
                                            required
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option>MCQ</option>
                                            <option>Numerical</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Chapter, Difficulty and Exam */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Chapter *</label>
                                        <select
                                            required
                                            value={formData.chapter}
                                            onChange={e => setFormData({ ...formData, chapter: e.target.value, topic: '' })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                            disabled={!formData.subject}
                                        >
                                            <option value="">Select Chapter</option>
                                            {getChaptersForSubject(formData.subject).map((ch: any) => (
                                                <option key={ch.id} value={ch.name}>{ch.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty *</label>
                                        <select
                                            required
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Exam Category *</label>
                                        <select
                                            required
                                            value={formData.examCategory}
                                            onChange={e => setFormData({ ...formData, examCategory: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option>JEE</option>
                                            <option>NEET</option>
                                            <option>SSC</option>
                                            <option>Boards</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Topic and Marks */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Topic *</label>
                                        <select
                                            required
                                            value={formData.topic}
                                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                            disabled={!formData.chapter}
                                        >
                                            <option value="">Select Topic</option>
                                            {getTopicsForChapter(formData.chapter).map((topic: string, idx: number) => (
                                                <option key={idx} value={topic}>{topic}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Marks *</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.marks}
                                            onChange={e => setFormData({ ...formData, marks: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="4"
                                            min="1"
                                            max="10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Negative Marks</label>
                                        <input
                                            type="number"
                                            value={formData.negativeMarks}
                                            onChange={e => setFormData({ ...formData, negativeMarks: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="-1"
                                            step="0.25"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Typically -1 for JEE Mains (MCQ only)</p>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Question Text *</label>
                                    <textarea
                                        required
                                        value={formData.text}
                                        onChange={e => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                                        placeholder="Enter the complete question text..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Question Text (Hindi)</label>
                                    <textarea
                                        value={formData.textHindi}
                                        onChange={e => setFormData({ ...formData, textHindi: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                                        placeholder="हिंदी में प्रश्न लिखें (वैकल्पिक)"
                                    />
                                </div>

                                {/* Options (for MCQ) */}
                                {formData.type === 'MCQ' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Options *</label>
                                        <div className="space-y-2">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.options[i]}
                                                        onChange={e => handleOptionChange(i, e.target.value)}
                                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                                        placeholder={`Option ${i + 1}`}
                                                    />
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={formData.correctAnswer === String(i)}
                                                        onChange={() => setFormData({ ...formData, correctAnswer: String(i) })}
                                                        className="w-4 h-4"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Select the correct answer using the radio button</p>
                                    </div>
                                )}

                                {formData.type === 'MCQ' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Hindi Options (Optional)</label>
                                        <div className="space-y-2">
                                            {[0, 1, 2, 3].map((i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    value={formData.optionsHindi[i]}
                                                    onChange={e => handleOptionHindiChange(i, e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    placeholder={`Option ${String.fromCharCode(65 + i)} in Hindi`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Hindi translations for the options are optional but helpful for bilingual uploads.</p>
                                    </div>
                                )}



                                {/* Correct Answer (for Numerical) */}
                                {formData.type === 'Numerical' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Correct Answer *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.correctAnswer}
                                            onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="Enter numerical value (e.g., 9.8 or 100)"
                                        />
                                    </div>
                                )}

                                {/* Explanation (Optional) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Explanation (Optional)</label>
                                    <textarea
                                        value={formData.explanation}
                                        onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                                        placeholder="Provide a detailed solution or explanation for this question..."
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Add step-by-step solution for students</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                    {isSubmitting ? 'Creating Question...' : 'Add Question'}
                                </button>
                            </form>
                            {/* Delete Confirmation Modal */}
                            <AnimatePresence>
                                {confirmDeleteId && (
                                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                        <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.95, opacity: 0 }}
                                            className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
                                        >
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                    <AlertTriangle className="text-red-600" size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-800">Delete Question?</h3>
                                                    <p className="text-slate-500 mt-2">
                                                        Are you sure you want to delete this question? This action cannot be undone and it will be removed from any tests using it.
                                                    </p>
                                                </div>
                                                <div className="flex gap-3 w-full pt-4">
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        disabled={isDeletingLoading}
                                                        className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(confirmDeleteId)}
                                                        disabled={isDeletingLoading}
                                                        className="flex-1 px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                                                    >
                                                        {isDeletingLoading ? (
                                                            <>
                                                                <Loader2 className="animate-spin" size={18} />
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            'Delete Now'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}

            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setIsEditing(false); setEditingQuestion(null); }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-slate-800">Edit Question</h2>
                                <button onClick={() => { setIsEditing(false); setEditingQuestion(null); }}><X size={24} className="text-slate-400" /></button>
                            </div>
                            {/* Same form as create but with handleUpdate */}
                            <form onSubmit={handleUpdate} className="p-6 space-y-4">

                                {/* Subject and Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Subject *</label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value as any, chapter: '', topic: '' })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            {subjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Question Type *</label>
                                        <select
                                            required
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option>MCQ</option>
                                            <option>Numerical</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Chapter, Difficulty and Exam */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Chapter *</label>
                                        <select
                                            required
                                            value={formData.chapter}
                                            onChange={e => setFormData({ ...formData, chapter: e.target.value, topic: '' })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                            disabled={!formData.subject}
                                        >
                                            <option value="">Select Chapter</option>
                                            {getChaptersForSubject(formData.subject).map((ch: any) => (
                                                <option key={ch.id} value={ch.name}>{ch.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty *</label>
                                        <select
                                            required
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Exam Category *</label>
                                        <select
                                            required
                                            value={formData.examCategory}
                                            onChange={e => setFormData({ ...formData, examCategory: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option>JEE</option>
                                            <option>NEET</option>
                                            <option>SSC</option>
                                            <option>Boards</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Topic, Marks and Negative Marks */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Topic *</label>
                                        <select
                                            required
                                            value={formData.topic}
                                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                            disabled={!formData.chapter}
                                        >
                                            <option value="">Select Topic</option>
                                            {getTopicsForChapter(formData.chapter).map((topic: string, idx: number) => (
                                                <option key={idx} value={topic}>{topic}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Marks *</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.marks}
                                            onChange={e => setFormData({ ...formData, marks: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="4"
                                            min="1"
                                            max="10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Negative Marks</label>
                                        <input
                                            type="number"
                                            value={formData.negativeMarks}
                                            onChange={e => setFormData({ ...formData, negativeMarks: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="-1"
                                            step="0.25"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Typically -1 for JEE Mains (MCQ only)</p>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Question Text *</label>
                                    <textarea
                                        required
                                        value={formData.text}
                                        onChange={e => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                                        placeholder="Enter the complete question text..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Question Text (Hindi)</label>
                                    <textarea
                                        value={formData.textHindi}
                                        onChange={e => setFormData({ ...formData, textHindi: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                                        placeholder="हिंदी में प्रश्न लिखें (वैकल्पिक)"
                                    />
                                </div>

                                {/* Options (for MCQ) */}
                                {formData.type === 'MCQ' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Options *</label>
                                        <div className="space-y-2">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.options[i]}
                                                        onChange={e => handleOptionChange(i, e.target.value)}
                                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                                        placeholder={`Option ${i + 1}`}
                                                    />
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={formData.correctAnswer === String(i)}
                                                        onChange={() => setFormData({ ...formData, correctAnswer: String(i) })}
                                                        className="w-4 h-4"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Select the correct answer using the radio button</p>
                                    </div>
                                )}

                                {formData.type === 'MCQ' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Hindi Options (Optional)</label>
                                        <div className="space-y-2">
                                            {[0, 1, 2, 3].map((i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    value={formData.optionsHindi[i]}
                                                    onChange={e => handleOptionHindiChange(i, e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    placeholder={`Option ${String.fromCharCode(65 + i)} in Hindi`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Hindi translations for the options are optional but helpful for bilingual uploads.</p>
                                    </div>
                                )}



                                {/* Correct Answer (for Numerical) */}
                                {formData.type === 'Numerical' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Correct Answer *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.correctAnswer}
                                            onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="Enter numerical value (e.g., 9.8 or 100)"
                                        />
                                    </div>
                                )}

                                {/* Explanation (Optional) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Explanation (Optional)</label>
                                    <textarea
                                        value={formData.explanation}
                                        onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                                        placeholder="Provide a detailed solution or explanation for this question..."
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Add step-by-step solution for students</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Update Question
                                </button>

                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Import CSV Modal */}
            <AnimatePresence>
                {isImporting && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setIsImporting(false); setParsedRows([]); setValidationResults(new Map()); }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Import Questions from CSV or XLSX</h2>
                                    <p className="text-sm text-slate-500 mt-1">Upload a CSV or XLSX file to bulk import questions. Subject values map to Physics, Chemistry, or Mathematics categories.</p>
                                </div>
                                <button onClick={() => { setIsImporting(false); setParsedRows([]); setValidationResults(new Map()); }}>
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select CSV or XLSX File</label>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileSelect}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Required columns: text, textHindi, subject, chapter, topic, type, difficulty, marks, negativeMarks, optionA-D, optionHindiA-D, correctAnswer, explanation, examCategory
                                    </p>
                                </div>

                                {/* Preview and Validation */}
                                {parsedRows.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <h3 className="font-bold text-slate-800">
                                                    Preview ({parsedRows.length} rows found)
                                                </h3>
                                                <div className="text-sm text-slate-500 mt-0.5">
                                                    Valid: <span className="text-green-600 font-bold">{Array.from(validationResults.values()).filter(v => v.valid).length}</span> |
                                                    Invalid: <span className="text-red-600 font-bold">{Array.from(validationResults.values()).filter(v => !v.valid).length}</span>
                                                </div>
                                            </div>
                                            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                                                <button
                                                    onClick={() => setImportView('table')}
                                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${importView === 'table' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                                                >
                                                    Table View
                                                </button>
                                                <button
                                                    onClick={() => setImportView('mcq')}
                                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${importView === 'mcq' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                                                >
                                                    MCQ Format
                                                </button>
                                            </div>
                                        </div>

                                        {/* Preview Content */}
                                        <div className="max-h-[50vh] overflow-auto border border-slate-100 rounded-xl bg-slate-50/30 p-4">
                                            {importView === 'table' ? (
                                                <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 font-bold text-slate-600">Status</th>
                                                                <th className="px-4 py-3 font-bold text-slate-600">Question Text</th>
                                                                <th className="px-4 py-3 font-bold text-slate-600">Subject</th>
                                                                <th className="px-4 py-3 font-bold text-slate-600">Chapter</th>
                                                                <th className="px-4 py-3 font-bold text-slate-600">Type</th>
                                                                <th className="px-4 py-3 font-bold text-slate-600">Errors</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-50">
                                                            {parsedRows.map((row, index) => {
                                                                const validation = validationResults.get(index);
                                                                return (
                                                                    <tr key={index} className={validation?.valid ? 'hover:bg-green-50/30' : 'bg-red-50/30 hover:bg-red-50/50'}>
                                                                        <td className="px-4 py-3">
                                                                            {validation?.valid ? (
                                                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                                                                            ) : (
                                                                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">✗</div>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3 max-w-xs truncate font-medium text-slate-700">{row.text}</td>
                                                                        <td className="px-4 py-3 text-slate-600">{row.subject}</td>
                                                                        <td className="px-4 py-3 text-slate-600">{row.chapter}</td>
                                                                        <td className="px-4 py-3 text-slate-600">{row.type}</td>
                                                                        <td className="px-4 py-3 text-xs text-red-600 font-medium">
                                                                            {validation?.errors.slice(0, 2).join(', ')}
                                                                            {validation && validation.errors.length > 2 ? '...' : ''}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {parsedRows.map((row, index) => {
                                                        const validation = validationResults.get(index);
                                                        if (!validation?.valid && importView === 'mcq') return null; // Only show valid in MCQ view

                                                        return (
                                                            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider">
                                                                        {row.subject} • {row.difficulty}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-slate-400">Row {index + 1}</span>
                                                                </div>

                                                                <h4 className="text-sm font-bold text-slate-800 mb-2 line-clamp-3 leading-relaxed">
                                                                    {row.text}
                                                                </h4>
                                                                {row.textHindi && (
                                                                    <h4 className="text-sm font-medium text-slate-500 mb-4 line-clamp-3 leading-relaxed italic">
                                                                        {row.textHindi}
                                                                    </h4>
                                                                )}

                                                                {row.type === 'MCQ' ? (
                                                                    <div className="space-y-2 mb-4">
                                                                        {[
                                                                            { label: 'A', text: row.optionA, hindi: row.optionHindiA },
                                                                            { label: 'B', text: row.optionB, hindi: row.optionHindiB },
                                                                            { label: 'C', text: row.optionC, hindi: row.optionHindiC },
                                                                            { label: 'D', text: row.optionD, hindi: row.optionHindiD }
                                                                        ].map((opt, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className={`flex flex-col gap-1 p-2.5 rounded-xl border text-xs transition-colors ${Number(row.correctAnswer) === i
                                                                                    ? 'bg-teal-50 border-teal-200 text-teal-800 font-bold'
                                                                                    : 'bg-slate-50/50 border-slate-100 text-slate-600'
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${Number(row.correctAnswer) === i ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                                                        {opt.label}
                                                                                    </div>
                                                                                    <span className="flex-1">{opt.text}</span>
                                                                                    {Number(row.correctAnswer) === i && <span className="text-[10px] uppercase font-black text-teal-600">Correct</span>}
                                                                                </div>
                                                                                {opt.hindi && (
                                                                                    <div className="pl-8 text-[11px] text-slate-500 italic">
                                                                                        {opt.hindi}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Numerical Answer</span>
                                                                        <span className="text-sm font-black text-slate-700">{row.correctAnswer}</span>
                                                                    </div>
                                                                )}

                                                                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                                    <span>{row.chapter}</span>
                                                                    <span>{row.marks} Marks</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {Array.from(validationResults.values()).filter(v => v.valid).length === 0 && (
                                                        <div className="col-span-full py-12 text-center text-slate-500 italic">
                                                            No valid questions found to preview in MCQ format.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload Progress */}
                                        {isUploading && (
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                    <span>Uploading Questions...</span>
                                                    <span>{Math.round(uploadProgress)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="bg-linear-to-r from-teal-500 to-indigo-600 h-full transition-all duration-500 relative"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Import Button */}
                                        <button
                                            onClick={handleImportCSV}
                                            disabled={isUploading || Array.from(validationResults.values()).filter(v => v.valid).length === 0}
                                            className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-600 active:scale-[0.98] transition-all duration-300 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                                        >
                                            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                            {isUploading ? 'IMPORTING DATA...' : `IMPORT ${Array.from(validationResults.values()).filter(v => v.valid).length} VALID QUESTIONS`}
                                        </button>
                                    </div>
                                )}

                                {importFile === null && parsedRows.length === 0 && (
                                    <div className="text-center py-8 text-slate-500">
                                        <Upload size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>Select a CSV file to begin importing</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminQuestionBank;
