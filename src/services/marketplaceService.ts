import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

export interface MarketplaceItem {
    id: string;
    title: string;
    price: number;
    type: 'testSeries' | 'pyq' | 'resource';
    [key: string]: any;
}

export const marketplaceService = {
    /**
     * Enroll a student in a marketplace item (Test Series, PYQ, or Resource)
     */
    enrollInItem: async (userId: string, item: any) => {
        try {
            if (!userId) throw new Error("User ID is required for enrollment");
            if (!item || !item.id) throw new Error("Invalid item data for enrollment");

            const itemId = item.id;
            const purchasesRef = collection(db, 'users', userId, 'purchases');
            
            // 1. Manual check for duplicates before adding
            const q = query(purchasesRef, where('itemId', '==', itemId));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                console.log("User already enrolled in:", itemId);
                return { success: true, message: "Already enrolled" };
            }

            // 2. Prepare unified purchase data
            const purchaseData: any = {
                itemId: itemId,
                seriesId: itemId, 
                testId: itemId,   
                title: item.name || item.title || "Unnamed Item",
                seriesTitle: item.name || item.title || "Unnamed Item",
                type: item.type || (item.pricing ? 'testSeries' : 'resource'),
                price: item.pricing ? (item.pricing.type === 'free' ? 0 : item.pricing.amount) : (item.price || 0),
                category: item.examCategory || item.category || "General",
                purchaseDate: serverTimestamp(),
                status: 'active',
                createdAt: serverTimestamp()
            };

            console.log("Enrolling user:", userId, "in item:", itemId);
            await addDoc(purchasesRef, purchaseData);
            
            console.log("Enrollment successful for:", itemId);
            return { success: true, message: "Enrolled successfully" };
        } catch (error: any) {
            console.error("Marketplace enrollment error details:", error);
            throw new Error(`Enrollment failed: ${error.message || 'Unknown error'}`);
        }
    }
};
