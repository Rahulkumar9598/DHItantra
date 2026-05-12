import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as fs from 'fs';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7KvJBN7IqG4g6pzE5Y1rHeFaYF2hvGEc",
    authDomain: "examinant-92c23.firebaseapp.com",
    projectId: "examinant-92c23",
    storageBucket: "examinant-92c23.firebasestorage.app",
    messagingSenderId: "764046336877",
    appId: "1:764046336877:web:1f8cfabf3bf4e7a59bee96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadClass10Questions() {
    try {
        // Read the questions
        const questionsRaw = fs.readFileSync('class10_questions.json', 'utf-8');
        const questions = JSON.parse(questionsRaw);

        console.log(`📚 Uploading ${questions.length} Class 10 questions...\n`);

        let uploaded = 0;
        const questionIds = [];

        for (const question of questions) {
            try {
                const docRef = await addDoc(collection(db, 'questions'), {
                    ...question,
                    createdAt: serverTimestamp()
                });
                questionIds.push(docRef.id);
                uploaded++;

                if (uploaded % 10 === 0) {
                    console.log(`  ✅ Uploaded ${uploaded}/${questions.length} questions`);
                }
            } catch (error) {
                console.error(`  ❌ Error uploading question:`, error);
            }
        }

        console.log(`\n✅ Successfully uploaded ${uploaded} Class 10 questions`);

        // Save the question IDs for creating tests
        fs.writeFileSync('class10_question_ids.json', JSON.stringify(questionIds, null, 2));
        console.log('💾 Question IDs saved to class10_question_ids.json');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

uploadClass10Questions();