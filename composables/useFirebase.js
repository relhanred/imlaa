// composables/useFirebase.js
import {
    doc,
    collection,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export const useFirebase = () => {
    const { $firebase } = useNuxtApp();
    const { firestore, auth, storage } = $firebase;

    // Récupérer les données utilisateur
    const user = computed(() => auth.currentUser);

    // Auth
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
            throw error;
        }
    };

    // Gestion des dictées
    const getDictations = async (level, knownLetters = null) => {
        try {
            let dictationsQuery;

            if (level === 'beginner' && knownLetters) {
                // Pour les débutants, filtrer les dictées contenant uniquement les lettres connues
                dictationsQuery = query(
                    collection(firestore, 'dictations'),
                    where('level', '==', level),
                    orderBy('difficulty')
                );

                // Note: Le filtrage par lettres connues sera fait en post-traitement
                // car Firestore ne peut pas facilement filtrer sur ce critère complexe
            } else {
                // Pour les niveaux avancés, récupérer toutes les dictées du niveau
                dictationsQuery = query(
                    collection(firestore, 'dictations'),
                    where('level', '==', level),
                    orderBy('difficulty')
                );
            }

            const snapshot = await getDocs(dictationsQuery);
            let dictations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filtrer les dictées pour les débutants
            if (level === 'beginner' && knownLetters) {
                const knownLettersSet = new Set(knownLetters.split(''));
                dictations = dictations.filter(dictation => {
                    // Vérifier que chaque lettre du texte arabe est dans les lettres connues
                    return [...dictation.arabic].every(char => {
                        // Ignorer les espaces, la ponctuation, etc.
                        return knownLettersSet.has(char) || !(/\p{Script=Arabic}/u.test(char));
                    });
                });
            }

            return dictations;
        } catch (error) {
            console.error('Erreur lors de la récupération des dictées:', error);
            throw error;
        }
    };

    const getDictation = async (id) => {
        try {
            const docRef = doc(firestore, 'dictations', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            } else {
                console.error('Aucune dictée trouvée avec cet ID');
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la dictée:', error);
            throw error;
        }
    };

    const addDictation = async (dictationData) => {
        try {
            const docRef = await addDoc(collection(firestore, 'dictations'), dictationData);
            return docRef.id;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la dictée:', error);
            throw error;
        }
    };

    const updateDictation = async (id, dictationData) => {
        try {
            const docRef = doc(firestore, 'dictations', id);
            await updateDoc(docRef, dictationData);
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la dictée:', error);
            throw error;
        }
    };

    const deleteDictation = async (id) => {
        try {
            const docRef = doc(firestore, 'dictations', id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la dictée:', error);
            throw error;
        }
    };

    // Gestion des fichiers audio
    const uploadAudio = async (file, path) => {
        try {
            const fileRef = storageRef(storage, path);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier audio:', error);
            throw error;
        }
    };

    return {
        user,
        login,
        register,
        logout,
        getDictations,
        getDictation,
        addDictation,
        updateDictation,
        deleteDictation,
        uploadAudio
    };
};