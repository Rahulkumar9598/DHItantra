import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Copy, AlertTriangle, Loader2, X } from 'lucide-react';
import type { TestSeries } from '../../types/test.types';
import {
    getAllTestSeries,
    createTestSeries,
    updateTestSeries,
    deleteTestSeries,
    duplicateTestSeries
} from '../../services/testSeriesService';

const TestSeriesManagement = () => {
    const navigate = useNavigate();
    const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingSeries, setEditingSeries] = useState<TestSeries | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Deletion Modal State
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeletingLoading, setIsDeletingLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    const [formData, setFormData] = useState<{
        name: string;
        examCategory: 'JEE' | 'NEET' | 'SSC' | string;
        pricing: { type: 'free' | 'paid'; amount: number };
        description: string;
        status: 'draft' | 'published' | 'archived';
    }>({
        name: '',
        examCategory: 'JEE',
        pricing: { type: 'free', amount: 0 },
        description: '',
        status: 'draft'
    });

    const [customCategory, setCustomCategory] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    useEffect(() => {
        loadTestSeries();
    }, []);

    const loadTestSeries = async () => {
        setIsLoading(true);
        try {
            const data = await getAllTestSeries();
            setTestSeries(data);
        } catch (error) {
            console.error('Error loading test series:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            const finalData = {
                ...formData,
                examCategory: isCustom ? customCategory : formData.examCategory
            };

            if (isCustom && !customCategory) {
                alert('Please enter a custom category name');
                setIsSubmitting(false);
                return;
            }

            await delay(1000); // Artificial delay
            await createTestSeries(finalData, 'admin');
            await loadTestSeries();
            setIsCreating(false);
            resetForm();
        } catch (error) {
            console.error('Error creating test series:', error);
            alert('Failed to create test series');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingSeries) return;

        setIsSubmitting(true);
        try {
            const finalData = {
                ...formData,
                examCategory: isCustom ? customCategory : formData.examCategory
            };

            if (isCustom && !customCategory) {
                alert('Please enter a custom category name');
                setIsSubmitting(false);
                return;
            }

            await delay(1000); // Artificial delay
            await updateTestSeries(editingSeries.id, finalData);
            await loadTestSeries();
            setEditingSeries(null);
            resetForm();
        } catch (error) {
            console.error('Error updating test series:', error);
            alert('Failed to update test series');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeletingLoading(true);
        try {
            await delay(1000); // Artificial delay
            await deleteTestSeries(id);
            await loadTestSeries();
            setConfirmDeleteId(null);
        } catch (error) {
            console.error('Error deleting test series:', error);
            alert('Failed to delete test series');
        } finally {
            setIsDeletingLoading(false);
        }
    };

    const handleDuplicate = async (series: TestSeries) => {
        try {
            await duplicateTestSeries(series.id, `${series.name} (Copy)`, 'admin');
            await loadTestSeries();
        } catch (error) {
            console.error('Error duplicating test series:', error);
            alert('Failed to duplicate test series');
        }
    };

    const handleEdit = (series: TestSeries) => {
        const predefinedCategories = ['JEE', 'NEET', 'SSC'];
        const isPredefined = predefinedCategories.includes(series.examCategory);

        setEditingSeries(series);
        setFormData({
            name: series.name,
            examCategory: isPredefined ? series.examCategory : 'Custom',
            pricing: {
                type: series.pricing.type,
                amount: series.pricing.amount || 0
            },
            description: series.description,
            status: series.status
        });

        if (!isPredefined) {
            setCustomCategory(series.examCategory);
            setIsCustom(true);
        } else {
            setCustomCategory('');
            setIsCustom(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            examCategory: 'JEE',
            pricing: { type: 'free', amount: 0 },
            description: '',
            status: 'draft'
        });
        setCustomCategory('');
        setIsCustom(false);
    };

    const filteredSeries = testSeries.filter(series => {
        const matchesSearch = (series.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (series.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || series.examCategory === filterCategory;
        const matchesStatus = filterStatus === 'all' || series.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Test Series Management</h1>
                    <p className="text-slate-500 mt-1">Create and manage premium test series for your students</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin-dashboard/create-test')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Plus size={20} /> Create New Test
                    </button>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <Plus size={20} /> Create Test Series
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search via name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="SSC">SSC</option>
                        <option value="Custom">Custom</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Test Series Grid */}
            {isLoading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 mt-4 font-medium animate-pulse">Loading amazing content...</p>
                </div>
            ) : filteredSeries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No test series found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting filters or create a new one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSeries.map((series) => (
                        <motion.div
                            key={series.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group"
                        >
                            {/* Card Header image placeholder or gradient */}
                            <div className={`h-32 p-6 relative overflow-hidden ${series.examCategory === 'JEE' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' :
                                    series.examCategory === 'NEET' ? 'bg-gradient-to-br from-emerald-500 to-teal-700' :
                                        'bg-gradient-to-br from-purple-600 to-pink-700'
                                }`}>
                                {/* Abstract Shapes */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-5 pointer-events-none"></div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold border border-white/10 shadow-sm">
                                        {series.examCategory}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${series.pricing?.type === 'free'
                                        ? 'bg-emerald-400 text-emerald-900'
                                        : 'bg-amber-400 text-amber-900'
                                        }`}>
                                        {series.pricing?.type === 'free' ? 'FREE' : `₹${series.pricing?.amount}`}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {series.name}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                                    {series.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            {series.testIds?.length || 0} Tests
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${series.status === 'published' ? 'bg-green-500' :
                                                    series.status === 'draft' ? 'bg-yellow-500' : 'bg-slate-400'
                                                }`}></div>
                                            {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-3 gap-2 mt-6">
                                    <button
                                        onClick={() => handleEdit(series)}
                                        className="col-span-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-semibold"
                                        title="Edit Series"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDuplicate(series)}
                                        className="col-span-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors text-sm font-semibold"
                                        title="Clone Series"
                                    >
                                        <Copy size={16} /> Clone
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeleteId(series.id)}
                                        className="col-span-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors text-sm font-semibold"
                                        title="Delete Series"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(isCreating || editingSeries) && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => { if (!isDeletingLoading) { setIsCreating(false); setEditingSeries(null); resetForm(); } }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingSeries ? 'Edit Test Series' : 'Create New Test Series'}
                                </h2>
                                <button
                                    onClick={() => { setIsCreating(false); setEditingSeries(null); resetForm(); }}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Test Series Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., JEE Mains 2024 Mock Tests"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                </div>

                                {/* Exam Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Examination Category *
                                    </label>
                                    <select
                                        value={formData.examCategory}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData({ ...formData, examCategory: val as any });
                                            setIsCustom(val === 'Custom');
                                        }}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="JEE">JEE</option>
                                        <option value="NEET">NEET</option>
                                        <option value="SSC">SSC</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                    {isCustom && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3"
                                        >
                                            <input
                                                type="text"
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                placeholder="Enter Category Name (e.g., UPSC, GATE)"
                                                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
                                                autoFocus
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Pricing */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Pricing *
                                    </label>
                                    <div className="flex gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={formData.pricing.type === 'free'}
                                                onChange={() => setFormData({ ...formData, pricing: { type: 'free', amount: 0 } })}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="font-medium text-slate-700">Free</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={formData.pricing.type === 'paid'}
                                                onChange={() => setFormData({ ...formData, pricing: { type: 'paid', amount: 0 } })}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="font-medium text-slate-700">Paid</span>
                                        </label>
                                    </div>
                                    {formData.pricing.type === 'paid' && (
                                        <div className="mt-3 relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                            <input
                                                type="number"
                                                value={formData.pricing.amount}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    pricing: { ...formData.pricing, amount: Number(e.target.value) }
                                                })}
                                                placeholder="Enter amount"
                                                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe this test series..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-200 flex gap-3 bg-slate-50 rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => { setIsCreating(false); setEditingSeries(null); resetForm(); }}
                                    className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={editingSeries ? handleUpdate : handleCreate}
                                    disabled={isSubmitting || !formData.name || !formData.description}
                                    className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            {editingSeries ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            {editingSeries ? <Edit2 size={18} /> : <Plus size={18} />}
                                            {editingSeries ? 'Update Series' : 'Create Series'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal */}
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
                                    <h3 className="text-xl font-bold text-slate-800">Delete Test Series?</h3>
                                    <p className="text-slate-500 mt-2">
                                        Are you sure you want to delete this test series? All tests associated with it will be affected. This action cannot be undone.
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
    );
};

export default TestSeriesManagement;
