import PageLayout from '../components/landing/PageLayout';

const DisclaimerPage = () => {
    return (
        <PageLayout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">DISCLAIMER</h1>
                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-6">
                            The content available on Dhitantra is provided for educational and practice purposes only.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. No Guarantee</h2>
                        <p className="mb-6">We do not guarantee any specific results, rankings, or success in examinations.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. No Affiliation</h2>
                        <p className="mb-6">Dhitantra is not affiliated with any government body, examination authority, or regulatory organization unless explicitly stated.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Content Accuracy</h2>
                        <p className="mb-6">While we strive for accuracy, we do not guarantee that all content is error-free.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Use at Your Own Risk</h2>
                        <p className="mb-6">Users are advised to use the platform as a supplementary learning tool.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default DisclaimerPage;
