/**
 * Sign Out React Hook
 *
 * Call the hook to sign out and delete all the auth state
 *
 * This will remove the authState from memory and
 * also remove the stored data from cookie or localstorage
*
 * @returns React Hook with SignOut Functionality
 *
 * @example
 * Here's a simple example:
 * ```js
 * import useSignOut from 'react-auth-kit/hooks/useSignOut'
 *
 * const SecureComponent = () => {
 *   const signOut = useSignOut()
 *   return (
 *     <button onClick={() => signOut()}>Sign Out!</button>
 *   )
 * }
 * ```
 * @remarks
 * For Now, this hook doesn't redirect automatically.
 * So one needs to write the redirect logic himself.
 *
 * ```js
 * const signOut = useSignOut()
 * signOut()
 * navigate('/login')
 * ```
 *
 * @throws AuthError
 * Thrown if the Hook is used outside the Provider Scope
 *
 */
declare function useSignOut(): (navigateTo?: string) => void;
export default useSignOut;
