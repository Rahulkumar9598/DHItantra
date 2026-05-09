import PageLayout from '../components/landing/PageLayout';

const TermsPage = () => {
    return (
        <PageLayout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms and Conditions</h1>

                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-2 font-semibold">Last Updated: 15th March 2026</p>
                        <p className="mb-6">
                            Welcome to Dhitantra ("Platform", "we", "our", "us"). By accessing or using our website and services, you agree to comply with and be bound by these Terms & Conditions.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eligibility</h2>
                        <p className="mb-6">You must be at least 13 years old to use the platform. If you are under 18, you must use the platform under parental or guardian supervision.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Services Offered</h2>
                        <p className="mb-6">Dhitantra provides AI-powered test series, quizzes, performance analytics, and educator-driven content for learning and assessment purposes.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
                        <p className="mb-4">You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Use the platform for unlawful purposes</li>
                            <li>Attempt to manipulate test results or rankings</li>
                            <li>Share login credentials with others</li>
                            <li>Copy, reproduce, or distribute content without permission</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Account Usage</h2>
                        <p className="mb-6">Users are responsible for maintaining the confidentiality of their login credentials. Any activity under your account will be deemed your responsibility.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subscription & Payments</h2>
                        <p className="mb-6">Access to certain features requires a paid subscription. Subscription terms, validity, and usage limits will be clearly communicated at the time of purchase.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
                        <p className="mb-6">All content, including tests, questions, designs, and branding, is the intellectual property of Dhitantra and protected under applicable laws.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Termination</h2>
                        <p className="mb-6">We reserve the right to suspend or terminate accounts for violations of these terms without prior notice.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
                        <p className="mb-6">We are not liable for any direct or indirect damages arising from the use of the platform.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Modifications</h2>
                        <p className="mb-6">We may update these Terms at any time. Continued use of the platform implies acceptance of updated terms.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Governing Law</h2>
                        <p className="mb-6">These terms shall be governed by the laws of India.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default TermsPage;
