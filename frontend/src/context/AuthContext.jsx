import { createContext, useCallback, useContext, useLayoutEffect, useMemo } from 'react'
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/react'
import { setClerkTokenGetter } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useClerkAuth()
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerk()

  useLayoutEffect(() => {
    setClerkTokenGetter(getToken)
    return () => setClerkTokenGetter(null)
  }, [getToken])

  const user = useMemo(() => {
    if (!isSignedIn || !clerkUser) return null
    const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress
    return {
      id: clerkUser.id,
      username: clerkUser.username || clerkUser.firstName || primaryEmail || clerkUser.id,
      fullName: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
    }
  }, [clerkUser, isSignedIn])

  const logout = useCallback(() => signOut(), [signOut])
  const value = useMemo(() => ({ user, logout, isLoaded: authLoaded && userLoaded }), [user, logout, authLoaded, userLoaded])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
