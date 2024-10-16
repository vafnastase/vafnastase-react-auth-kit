import TokenObject from './RxTokenObject';
import type { createRefreshParamInterface } from './createRefresh';
/**
 * Store Creation Param
 */
interface createStoreParam<T> {
    /**
     * The name of the cookie or localstore object on which
     * the auth token is stored.
     *
     * This name will also be used as a prefix for all other cookies.
     */
    authName: string;
    /**
     * Type of the Storage.
     *
     * - `cookie` - Store all the auth information in the cookie
     * - `localstorage` - Store all the auth information in the localstorage
     */
    authType: 'cookie' | 'localstorage';
    /**
     * Domain of the cookie, for which the cookie is valid.
     *
     * Needed if you are using `cookie` as authType
     *
     * @see {@link https://github.com/js-cookie/js-cookie#domain}
     */
    cookieDomain?: string;
    /**
     * Indicating if the cookie transmission requires a secure protocol (https).
     *
     * Needed if you are using `cookie` as authType
     *
     * @see {@link https://github.com/js-cookie/js-cookie#secure}
     */
    cookieSecure?: boolean;
    /**
     * Refresh API. Created using `createRefresh` function.
     */
    refresh?: createRefreshParamInterface<T>;
    /**
     * Expiring time for refresh token in seeconds.
     * This is needed if you are using refresh tokens that are not JWT and cannot be parsed by a JWT parser.
     */
    refreshExpiresAt?: number;
    /**
     * If Debug or not. Use this to debug your auth flow
     */
    debug?: boolean;
}
/**
 * Return type of createStore Function
 */
export interface createStoreReturn<T> {
    /**
     * Instance of the token object
     */
    tokenObject: TokenObject<T>;
    /**
     * Instance of the Refresh interface, if there is any.
     */
    refresh?: createRefreshParamInterface<T>;
}
/**
 *
 * createStore creates the default store for React Auth Kit.
 *
 * This store is like a Redux store, where every object and data is stored in.
 *
 * @typeParam T - Type of User State Object
 * @param params - Parameter to create a new store for auth kit
 * @returns Auth Kit Store
 *
 * @example
 * Here is an example on JavaScript
 * ```jsx
 * import createStore from 'react-auth-kit/createStore';
 *
 * const store = createStore({
 *  authName:'_auth',
 *  authType:'cookie',
 *  cookieDomain: window.location.hostname,
 *  cookieSecure: window.location.protocol === 'https:'
 * })
 * ```
 *
 * Here is an example on TypeScript
 * ```tsx
 * interface IUserData {
 *  name: string;
 *  uuid: string;
 * };
 *
 * const store = createStore<IUserData>({
 *  authName:'_auth',
 *  authType:'cookie',
 *  cookieDomain: window.location.hostname,
 *  cookieSecure: window.location.protocol === 'https:'
 * })
 * ```
 */
export default function createStore<T>(params: createStoreParam<T>): createStoreReturn<T>;
export {};
