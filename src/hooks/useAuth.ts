import { useCallback, useEffect, useState } from 'react'
import { useWeb3 } from 'src/hooks/useWeb3'

import firebase, { auth } from '../../utils/firebase'
// import { auth, firebase } from '../../utils/firebase'

export const useAuth = () => {
  const [user, setUser] = useState<firebase.User>()
  const { createAccount } = useWeb3()

  // const initializeUser = useCallback(() => {
  //   const hoge = auth().onAuthStateChanged(async (newUser) => {
  //     console.log(newUser)
  //     if (newUser) {
  //       setUser(newUser)
  //       hoge()
  //     }
  //   })
  // }, [])

  const initializeUser = useCallback(() => {
    const unsubscribe = auth().onAuthStateChanged((newUser) => {
      console.log(newUser)
      if (newUser) {
        setUser(newUser)
        createAccount(newUser.uid)
      }
    })
    return () => unsubscribe()
  }, [createAccount])

  // }, [])
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
    return initializeUser()
  }, [initializeUser])

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()

    auth()
      .signInWithPopup(googleProvider)
      .then((userCredential) => {
        console.log('enter2')
        const user = userCredential.user
        if (user) {
          setUser(user)
          createAccount(user.uid)
        }
      })
  }
  // auth().signInWithRedirect(googleProvider)
  //   auth()
  //     .getRedirectResult()
  //     .then((userCredential) => {
  //       console.log('enter2')
  //       const user = userCredential.user
  //       if (user) {
  //         setUser(user)
  //         createAccount(user.uid)
  //       }
  //     })
  // }

  const signOut = async () => {
    await auth().signOut()
    setUser(undefined)
  }

  return {
    user,
    signIn,
    signOut,
  }
}
