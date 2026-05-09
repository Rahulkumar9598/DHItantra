import PageLayout from '../components/landing/PageLayout';

const GRPPage = () => {
    return (
        <PageLayout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8" style={{ wordSpacing: '0.2em' }}>GRIEVANCE REDRESSAL POLICY<br></br> (INDIA COMPLIANCE)</h1>
                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-2 font-semibold">Last Updated: 1st April 2026</p>
                        <p className="mb-6">
                            In accordance with the Information Technology Act, 2000 and applicable rules, Dhitantra has established a grievance redressal mechanism.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Scope</h2>
                        <p className="mb-6">Users may raise complaints regarding:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Content accuracy</li>
                            <li>Payment issues</li>
                            <li>Privacy concerns</li>
                            <li>Misuse of platform</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Process</h2>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Submit complaint via email</li>
                            <li>Include relevant details and screenshots</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Resolution Timeline</h2>
                        <p className="mb-6">All grievances will be acknowledged within 48 hours and resolved within 15 working days.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Escalation</h2>
                        <p className="mb-6">If not satisfied, users may escalate the issue through appropriate legal channels.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default GRPPage;
