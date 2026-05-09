import PageLayout from '../components/landing/PageLayout';

const CookiePolicyPage = () => {
    return (
        <PageLayout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">COOKIE POLICY</h1>
                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-2 font-semibold">Last Updated: 28th March 2026</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies</h2>
                        <p className="mb-6">Cookies are small files stored on your device to improve user experience.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>To remember user preferences</li>
                            <li>To track usage and improve performance</li>
                            <li>To enable essential platform functionality</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Types of Cookies</h2>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Essential Cookies – Required for platform operation</li>
                            <li>Analytics Cookies – Help us understand usage</li>
                            <li>Functional Cookies – Improve personalization</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Managing Cookies</h2>
                        <p className="mb-6">You can control or disable cookies through your browser settings.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Consent</h2>
                        <p className="mb-6">By using our platform, you consent to the use of cookies.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CookiePolicyPage;
