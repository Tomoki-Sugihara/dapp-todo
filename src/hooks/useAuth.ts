import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useWeb3 } from 'src/hooks/useWeb3'
import { userState } from 'src/state/user'

import firebase, { auth } from '../../utils/firebase'

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState)
  const { createAccount } = useWeb3()

  const initializeUser = useCallback(() => {
    const unsubscribe = auth().onAuthStateChanged((newUser) => {
      if (newUser) {
        setUser(newUser)
        createAccount(newUser.uid)
      }
    })
    return () => unsubscribe()
  }, [setUser, createAccount])

  useEffect(() => {
    return initializeUser()
  }, [initializeUser])

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()

    auth()
      .signInWithPopup(googleProvider)
      .then((userCredential) => {
        const user = userCredential.user
        if (user) {
          setUser(user)
          createAccount(user.uid)
        }
      })
  }

  const signOut = async () => {
    await auth().signOut()
    setUser(null)
  }

  return {
    user,
    signIn,
    signOut,
  }
}
