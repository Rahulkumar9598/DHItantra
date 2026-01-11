import { db } from '../firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export interface DashboardStats {
    totalStudents: number;
    activeTestSeries: number;
    totalQuestions: number;
    totalChapters: number;
}

export const dashboardService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            // 1. Total Students (Users)
            // Ideally we filter by role="student", but assuming all users in 'users' collection who aren't admins are students
            const usersColl = collection(db, 'users');
            const studentsSnapshot = await getCountFromServer(usersColl);
            const totalStudents = studentsSnapshot.data().count;

            // 2. Active Test Series (status = 'published')
            const testSeriesColl = collection(db, 'testSeries');
            const activeSeriesQuery = query(testSeriesColl, where('status', '==', 'published'));
            const activeSeriesSnapshot = await getCountFromServer(activeSeriesQuery);
            const activeTestSeries = activeSeriesSnapshot.data().count;

            // 3. Question Bank (Total Questions)
            const questionsColl = collection(db, 'questions');
            const questionsSnapshot = await getCountFromServer(questionsColl);
            const totalQuestions = questionsSnapshot.data().count;

            // 4. Total Chapters
            const chaptersColl = collection(db, 'chapters');
            const chaptersSnapshot = await getCountFromServer(chaptersColl);
            const totalChapters = chaptersSnapshot.data().count;

            return {
                totalStudents,
                activeTestSeries,
                activeTestSeriesLive: activeTestSeries, // Alias/Derivative if needed
                totalQuestions,
                totalChapters
            } as any;

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            // Return fallback zeros on error
            return {
                totalStudents: 0,
                activeTestSeries: 0,
                totalQuestions: 0,
                totalChapters: 0
            };
        }
    },

    getAnalyticsData: async () => {
        // Mock data for the chart for now, as real historical tracking isn't implemented
        return [35, 60, 45, 80, 50, 70, 90];
    }
};
