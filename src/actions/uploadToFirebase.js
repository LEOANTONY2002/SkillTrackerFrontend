import { getStorage, ref, uploadBytes, FirebaseStorage, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBvOK2o2ttzNHkGZL2Ba_Ei0QhM_o8FyKM",
  authDomain: "changecx-skill-app.firebaseapp.com",
  projectId: "changecx-skill-app",
  storageBucket: "changecx-skill-app.appspot.com",
  messagingSenderId: "210749966814",
  appId: "1:210749966814:web:756f82a1977bca3261f54f",
  measurementId: "G-L6E49238NL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a root reference
const storage = getStorage(app);

export const uploadToFirebase = async (email, id, file) => {
    const ext = file?.type?.split('/')[1]
    const imageRef = ref(storage, `certificates/${email}/${id}.${ext}`);

    const snapshot = await uploadBytes(imageRef, file)

    const url = await getDownloadURL(snapshot.ref)
    console.log(url);
    return url
    
}