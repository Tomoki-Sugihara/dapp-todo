import { useCallback, useEffect, useState } from 'react'

import firebase, { auth } from '../../utils/firebase'
// import { auth, firebase } from '../../utils/firebase'

export const useAuth = () => {
  const [user, setUser] = useState<firebase.User>()

  const initializeUser = useCallback(() => {
    auth().onAuthStateChanged((newUser) => {
      if (newUser) {
        setUser(newUser)
      }
    })
  }, [])
  // const initializeUser = useCallback(() => {
  //   const unsubscribe = auth().onAuthStateChanged((newUser) => {
  //     // auth().onAuthStateChanged((user) => {
  //     if (newUser) {
  //       setUser(newUser)
  //       console.log(user)
  //     }
  //   })
  //   unsubscribe()
  // }, [user])

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  const redirect = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    auth().signInWithRedirect(googleProvider)

    auth()
      .getRedirectResult()
      .then((userCredential) => {
        const user = userCredential.user
        if (user) {
          setUser(user)
        }
      })
  }

  const logout = async () => {
    await auth().signOut()
    setUser(undefined)
  }

  return {
    user,
    redirect,
    logout,
  }
}
