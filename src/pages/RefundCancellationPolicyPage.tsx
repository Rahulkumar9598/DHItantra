import PageLayout from '../components/landing/PageLayout';

const RefundCancellationPolicyPage = () => {
    return (
        <PageLayout>
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Refund & Cancellation Policy</h1>

                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-2 font-semibold">Last Updated: 1st April 2026</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Subscription Nature</h2>
                        <p className="mb-6">All subscriptions are digital services and are activated immediately upon successful payment.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Refund Policy</h2>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Once a subscription is activated, it is non-refundable</li>
                            <li>Refunds may only be considered in cases of:
                                <ul className="list-[circle] pl-5 mt-2 space-y-1">
                                    <li>Failed transactions</li>
                                    <li>Duplicate payments</li>
                                    <li>Technical errors preventing access</li>
                                </ul>
                            </li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cancellation</h2>
                        <p className="mb-6">Users may choose not to renew their subscription. No partial refunds will be provided for unused periods.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Processing Time</h2>
                        <p className="mb-6">Approved refunds (if any) will be processed within 7–10 working days.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact</h2>
                        <p className="mb-6">For refund-related queries, contact: support@dhitantedu.com</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default RefundCancellationPolicyPage;
