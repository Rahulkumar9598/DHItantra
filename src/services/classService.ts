import { db } from '../firebase';
import { collection, doc, query, orderBy, onSnapshot, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface ClassRecord {
    id: string;
    name: string;
    createdAt?: any;
    updatedAt?: any;
}

export const DEFAULT_CLASSES: string[] = [
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
    'Dropper'
];

const classesCollection = collection(db, 'classes');

export const classService = {
    subscribe: (onUpdate: (classes: ClassRecord[]) => void) => {
        const classesQuery = query(classesCollection, orderBy('name', 'asc'));
        return onSnapshot(classesQuery, (snapshot) => {
            const loadedClasses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ClassRecord[];
            onUpdate(loadedClasses);
        });
    },

    getAll: async (): Promise<ClassRecord[]> => {
        const classesQuery = query(classesCollection, orderBy('name', 'asc'));
        const snapshot = await getDocs(classesQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ClassRecord[];
    },

    create: async (name: string) => {
        await addDoc(classesCollection, {
            name,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    update: async (id: string, name: string) => {
        const classRef = doc(classesCollection, id);
        await updateDoc(classRef, {
            name,
            updatedAt: serverTimestamp()
        });
    },

    delete: async (id: string) => {
        const classRef = doc(classesCollection, id);
        await deleteDoc(classRef);
    }
};
