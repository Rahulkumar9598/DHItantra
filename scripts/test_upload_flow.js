import { parseQuestionsCSV, validateQuestion, batchUploadQuestions } from '../src/utils/csvImporter.js';

// Test the Excel/CSV upload flow
async function testUploadFlow() {
    console.log('🧪 Testing Excel/CSV Upload Flow...\n');

    try {
        // Step 1: Read the sample file
        console.log('📁 Step 1: Reading sample file...');
        const response = await fetch('/templates/sample_questions.csv');
        const blob = await response.blob();
        const file = new File([blob], 'sample_questions.csv', { type: 'text/csv' });

        // Step 2: Parse the file
        console.log('🔄 Step 2: Parsing file data...');
        const parsedData = await parseQuestionsCSV(file);
        console.log(`✅ Parsed ${parsedData.data.length} rows`);
        console.log('Sample row:', parsedData.data[0]);

        // Step 3: Validate all rows
        console.log('\n🔍 Step 3: Validating data...');
        const validations = [];
        for (let i = 0; i < parsedData.data.length; i++) {
            const validation = await validateQuestion(parsedData.data[i], i);
            validations.push(validation);
            if (!validation.valid) {
                console.log(`❌ Row ${i + 1} invalid:`, validation.errors);
            }
        }

        const validRows = parsedData.data.filter((_, index) =>
            validations[index].valid
        );

        console.log(`✅ ${validRows.length}/${parsedData.data.length} rows are valid`);

        // Step 4: Show what would be uploaded
        console.log('\n📤 Step 4: Preview upload data...');
        validRows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.subject} - ${row.text.substring(0, 50)}...`);
        });

        // Step 5: Simulate upload (commented out to avoid actual database writes)
        console.log('\n💾 Step 5: Database storage (simulated)...');
        console.log('Would upload to Firestore "questions" collection');
        console.log('Each question would include: text, subject, chapter, topic, type, difficulty, marks, options, correctAnswer, explanation, createdAt');

        console.log('\n🎯 Step 6: Quiz system integration...');
        console.log('Questions would be queryable by: subject, chapter, topic, difficulty, type');
        console.log('Available for test generation and student attempts');

        console.log('\n✅ Upload flow test completed successfully!');

    } catch (error) {
        console.error('❌ Error during upload flow test:', error);
    }
}

// Run the test
testUploadFlow();