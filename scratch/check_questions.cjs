const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

// Minimal config for script
const firebaseConfig = {
  projectId: "examinant-85474"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function countQuestions() {
  console.log("Checking Chemistry -> Electrochemistry...");
  
  // 1. Find Chapter ID
  const chaptersQ = query(collection(db, 'chapters'), where('name', '==', 'Electrochemistry'));
  const chapterSnap = await getDocs(chaptersQ);
  
  if (chapterSnap.empty) {
    console.log("Electrochemistry chapter not found!");
    return;
  }
  
  const chapterDoc = chapterSnap.docs[0];
  const chapterId = chapterDoc.id;
  const topics = chapterDoc.data().topics || [];
  
  console.log(`Found Chapter ID: ${chapterId}`);
  console.log(`Topics in Chapter: ${topics.join(', ')}`);
  
  // 2. Count Total for Chapter
  const allQ = query(collection(db, 'questions'), where('chapterId', '==', chapterId));
  const allSnap = await getDocs(allQ);
  console.log(`\nTotal questions in Electrochemistry: ${allSnap.size}`);
  
  // 3. Count per Topic
  for (const topic of topics) {
    const topicQ = query(
      collection(db, 'questions'), 
      where('chapterId', '==', chapterId),
      where('topic', '==', topic)
    );
    const topicSnap = await getDocs(topicQ);
    console.log(`  - Topic [${topic}]: ${topicSnap.size} questions`);
  }
  
  process.exit(0);
}

countQuestions().catch(err => {
  console.error(err);
  process.exit(1);
});
