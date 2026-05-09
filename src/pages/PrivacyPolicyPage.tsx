import PageLayout from '../components/landing/PageLayout';

const PrivacyPolicyPage = () => {
    return (
        <PageLayout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-2 font-semibold">Last Updated: 18th March 2026</p>
                        <p className="mb-6">
                            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Personal Information: Name, email, phone number</li>
                            <li>Usage Data: Test attempts, scores, performance metrics</li>
                            <li>Technical Data: IP address, browser type, device information</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>To provide and improve services</li>
                            <li>To personalize user experience</li>
                            <li>To analyze performance and usage trends</li>
                            <li>To enhance AI-driven recommendations</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Sharing</h2>
                        <p className="mb-4">We do not sell your personal data. Data may be shared:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>With service providers (payment gateways, hosting)</li>
                            <li>When required by law</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
                        <p className="mb-6">We implement reasonable security practices as per applicable IT laws in India to protect your data.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cookies</h2>
                        <p className="mb-6">We use cookies to enhance user experience. (Refer to Cookie Policy)</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. User Rights</h2>
                        <p className="mb-4">You may request:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Access to your data</li>
                            <li>Correction or deletion of your data</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
                        <p className="mb-6">We retain data only as long as necessary for service and compliance purposes.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Updates</h2>
                        <p className="mb-6">We may update this policy from time to time.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default PrivacyPolicyPage;
