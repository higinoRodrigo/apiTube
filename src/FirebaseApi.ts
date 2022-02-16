import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import firebaseConfig from './firebaseConfig'

// if (!firebase.apps.length) {
//   return firebaseApp, db
// }
const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const batch = db.batch()

export default {
  googleSignin: async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await firebase.auth().signInWithPopup(provider)
    return result
  },
  firebaseApp,
  db,
  batch,
}
