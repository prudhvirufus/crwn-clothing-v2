import {initializeApp} from "firebase/app"
import {getAuth,signInWithRedirect,signInWithPopup,GoogleAuthProvider,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut,onAuthStateChanged
} from "firebase/auth"

import {getFirestore,doc,getDoc,setDoc,collection,
  writeBatch,
  query,
  getDocs,} from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyBkily37zDo8loN3zsZ3f9YUAL0azu_f-8",
    authDomain: "crwn-clothing-db-f2584.firebaseapp.com",
    projectId: "crwn-clothing-db-f2584",
    storageBucket: "crwn-clothing-db-f2584.appspot.com",
    messagingSenderId: "491842044339",
    appId: "1:491842044339:web:74ba79171cf93df7f94bc6",
    measurementId: "G-1J2GBQTFS9"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);


  const googleProvider = new GoogleAuthProvider()

  googleProvider.setCustomParameters({
    prompt:"select_account"
  })

export const auth = getAuth()

export const signInwithGooglePopup = ()=> signInWithPopup(auth,googleProvider)
 export const signInWithGoogleRedirect =()=> signInWithRedirect(auth,googleProvider)
 export const db = getFirestore()

//add new collection
export const addCollectionAndDocuments = async (collectionKey,objectsToAdd)=>{
    const collectionRef = collection(db,collectionKey)
    const bath = writeBatch(db);
    objectsToAdd.forEach((object) => {
      const docRef = doc(collectionRef,object.title.toLowerCase())
      bath.set(docRef,object)
    });
await bath.commit()
console.log("done")

}

export const getCategoriesAndDocuments = async ()=>{
   const collectionRef = collection(db,"categories")
  const q = query(collectionRef)

   const querySnapshot  = await getDocs(q)
   
   const categoryMap = querySnapshot.docs.reduce((acc,docSnapshot)=>{
   
    const {title,items} = docSnapshot.data();
       acc[title.toLowerCase()] = items;
         return acc
   },{})

   return categoryMap

}


 

  export const createUserDocumentFromAuth = async (userAuth,additionalInformation={})=>{
   if(!userAuth)

    console.log("createUserDocumentFromAuthfn")
      const userDocRef = doc(db, "users", userAuth.uid)
      //  console.log(userDocRef,"usertDocRef")
       const userSnapshot = await getDoc(userDocRef)
      //  console.log(userSnapshot.exists(),"userSnapshot")

     
     //if user data dosen't exists
     // create/set the document  with the data from userAuth in my collection
     if(!userSnapshot.exists()){
        const {displayName, email} = userAuth
         const createdAt = new Date()
         try{
        await setDoc(userDocRef,{
          displayName,
          email,
          createdAt,
          ...additionalInformation
        })
         }catch(error){
          console.log(error,"error created by user")
         }

     }
       return userDocRef
}


export const createAuthUserWithEmailAndPassword = async(email,password)=>{
    if(!email || !password) return;
    return await createUserWithEmailAndPassword(auth,email,password)
}

export const signInUserWithEmailAndPassword = async(email,password)=>{
    if(!email || !password) return;
    return await signInWithEmailAndPassword(auth,email,password)
}



export const signOutUser = async()=> await signOut(auth)

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth,callback)