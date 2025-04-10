import { db } from "../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Fetch emergency contacts from Firestore
export const getEmergencyContacts = async (setContacts) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
        const contactsRef = collection(db, "users", user.uid, "emergencyContacts");
        const snapshot = await getDocs(contactsRef);
        const contactsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setContacts(contactsList);
    } catch (error) {
        console.error("Error fetching emergency contacts:", error);
    }
};

// Delete an emergency contact
export const deleteEmergencyContact = async (id) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
        await deleteDoc(doc(db, "users", user.uid, "emergencyContacts", id));
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
};
