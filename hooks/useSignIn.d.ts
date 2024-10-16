import type { signInFunctionParams } from '../types';
/**
 * Sign In React Hook
 *
 * Call the hook to sign In and authenticate the user
 *
 * This will authenticate the user by writing the user state into the memory
 * Also, this will call the RX engine to store the auth in the storage
 *
 * @typeParam T - Type of User State Object
 * @param signInConfig - Params for sign In
 * @returns React Hook with SignIn Functionality
 *
 * @throws AuthError
 * - Thrown if the Hook is used outside the Provider Scope.
 * - Thrown if refresh token is added, in spite not used.
 * - Thrown if refresh token is not added, is spite used.
 *
 * @example
 * Here's an example without the refresh token:
 * ```jsx
 * import useSignIn from 'react-auth-kit/hooks/useSignIn'
 *
 * const LoginComponent = () => {
 *  const signIn = useSignIn()
 *  signIn({
 *    auth: {
 *      token: '<jwt token>'
 *    },
 *    userState: {name: 'React User', uid: 123456}
 *  })
 * }
 * ```
 *
 * Here's a an example with refresh token:
 * ```jsx
 * import useSignIn from 'react-auth-kit/hooks/useSignIn'
 *
 * const LoginComponent = () => {
 *  const signIn = useSignIn()
 *  signIn({
 *    auth: {
 *      token: '<jwt token>'
 *    },
 *    userState: {name: 'React User', uid: 123456},
 *    refresh: <refresh jwt token>
 *  })
 * }
 * ```
 *
 * Here's a an example with refresh token in TypeScript:
 * ```tsx
 * import useSignIn from 'react-auth-kit/hooks/useSignIn'
 *
 *  interface IUserData {
 *  name: string;
 *  uuid: string;
 * };
 *
 * const LoginComponent = () => {
 *  const signIn = useSignIn<IUserData>()
 *  signIn({
 *    auth: {
 *      token: '<jwt token>'
 *    },
 *    userState: {name: 'React User', uid: 123456},
 *    refresh: <refresh jwt token>
 *  })
 * }
 * ```
 *
 * @remarks
 * If you are using the refresh token, make sure you add that in the parameter,
 * else it throws AuthError
 *
 * If you are not using the refresh token, make sure you don't include
 * that in the parameter, else it throws AuthError.
 *
 */
declare function useSignIn<T>(): (signInConfig: signInFunctionParams<T>) => boolean;
export default useSignIn;
