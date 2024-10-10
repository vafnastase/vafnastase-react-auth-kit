import { AuthKitStateInterface } from './types';
/**
 * Set State Data
 */
export interface AuthKitSetState<T> {
    /**
     * Authentication Object
     */
    auth?: {
        /**
         * JWT access token
         */
        token: string;
        /**
         * Type of the access token
         *
         * @example
         * Bearer
         */
        type: string;
    } | null;
    /**
     * Refresh JWT token
     */
    refresh?: string | null;
    /**
     * User state object
     */
    userState?: T;
}
/**
 * TokenObject Class.
 * It is holding all the data for the authentication
 */
declare class TokenObject<T> {
    /**
     * Name of the storage for the access token
     */
    private readonly authStorageName;
    /**
     * Name of the storage for the user state
     */
    private readonly stateStorageName;
    /**
     * Domain Name for the cookie
     */
    private readonly cookieDomain?;
    /**
     * HTTP Secure for the cookie
     */
    private readonly cookieSecure?;
    /**
     * Name of the storage for the auth token type
     */
    private readonly authStorageTypeName;
    /**
     * Type of the Storage to be used to store the data
     */
    private readonly authStorageType;
    /**
     * Name of the storage for the refresh token
     */
    private readonly refreshTokenName;
    /**
     * Boolean value to check if the application
     * is using refresh token feature or not
     */
    private readonly isUsingRefreshToken;
    /**
     * Refresh Token Expiration time. Used for when the refresh token is not JWT.
     * @private
     */
    private refreshExpiresAt?;
    /**
     * Auth Value
     */
    private authValue;
    /**
     * RX Auth subject
     */
    private authSubject;
    /**
     * Debug variable. Use to create the debug environment
     */
    private readonly debug;
    /**
     * TokenObject - Stores, retrieve and process tokens
     *
     * @param authStorageName - Name of the Token,
     * which will store the Authorization Token
     *
     * @param authStorageType - Type of the auth Storage,
     * `cookie` or `localstorage`
     *
     * @param refreshTokenName - Name of the refresh Token,
     * if `undefined`, then no refreshToken feature is using
     *
     * @param cookieDomain - domain name for the Cookies,
     * only applicable when `authStorageType` is `cookie`
     *
     * @param cookieSecure - cookies are secure or not,
     * only applicable when `authStorageType` is `cookie`
     *
     * @param refreshExpiresAt - refresh token expiration
     * manual expiration time of the token.
     *
     *
     */
    constructor(authStorageName: string, authStorageType: 'cookie' | 'localstorage', refreshTokenName: string | null, debug: boolean, cookieDomain?: string, cookieSecure?: boolean, refreshExpiresAt?: number);
    /**
     * Subscribe method for TokenObject
     *
     * @param next - A callback function that gets called by the producer during
     * the subscription when the producer "has" the `value`. It won't be called
     * if `error` or `complete` callback functions have been called
     * @param error - A callback function that gets called by the producer
     * if and when it encountered a problem of any kind
     * @param complete - A callback function that gets called by the producer
     * if and when it has no more values to provide
     */
    subscribe: (next: ((value: AuthKitStateInterface<T>) => void), error?: ((err: any) => void), complete?: (() => void)) => void;
    /**
     * Callback hook, when the user is signed in this function will be called
     * @param callback - function to be called
     */
    onSignIn(callback: (value: AuthKitStateInterface<T>) => void): void;
    /**
     * Callback hook, when the user is signed out, this function will be called
     * @param callback - function to be called
     */
    onSignOut(callback: () => void): void;
    /**
     * @internal
     * @param data - The data to set the state
     *
     * @remarks
     * Below is the logic
     * ```txt
     * data
     *  |
     *  |---- new user state is present ----- Replace User state
     *  |
     *  |
     *  |---- new auth is present ----------- Replace Auth token
     *  |   |     and not null
     *  |   |
     *  |   |
     *  |   |
     *  |   ---- new auth is null ----------------------- Clean auth and
     *  |   |                                               userstate
     *  |   |
     *  |   ---- no new auth data ----------------------- Do nothing use the
     *  |            present                            old auth and user state
     *  |
     *  -- is using refesh token is true - new refresh is ---- Update the
     *   |                               |   present is       refresh token
     *   |                               |    not null
     *   |                               |
     *   |                               |
     *   |                               - new refresh ------- Clean refresh token
     *   |                               |   is null
     *   |                               |
     *   |                               - no new refresh ---- Do nothing use
     *   |                                                     the old refresh
     *   |
     *   -- is using refresh token is false ------------------ Do nothing use
     *                                                         the old refresh
     * ```
     */
    set: (data: AuthKitSetState<T>) => void;
    /**
     * Getter for currrent state for TokenObject
     */
    get value(): AuthKitStateInterface<T>;
    /**
     * Get the Initial Tokens and states from storage
     * when the Application is bootstrapping or refreshed
     *
     * @remarks
     * If the `authStorageType` is `cookie`,
     * get information from `initialCookieToken()` function
     *
     * If the `authTokenType` is `localStorage`
     * get information from `initialLSToken()` function
     *
     * @returns Initial State
     */
    private initialToken_;
    /**
     * Get the Initial Token from Cookies
     *
     * @remarks
     * If the `authStorageType` is `cookie`
     * then this function is called
     * And returns the Tokens and states Stored in all 4 cookies
     *
     * @returns Initial State from Cookies
     */
    private initialCookieToken_;
    /**
     * Get the Initial Token from LocalStorage
     *
     * @remarks
     * If the `authStorageType` is `localstorage`
     * then this function is called
     * And returns the Tokens and states Stored in all 4 cookies
     *
     * @returns Initial State from LocalStorage
     */
    private initialLSToken_;
    /**
     * Check for all the existance for the Tokens
     * Called Internally by `initialCookieToken_()` and `initialLSToken_()`
     *
     * @param authToken - Auth token from cookie or localstorage
     * @param authTokenType - Auth token type from cookie or localstorage
     * @param stateCookie - User state from cookie of localstorage
     * @param refreshToken - Refresh token from cookie or localstorage
     *
     * @returns Auth State with all conditions and guard in place
     */
    private checkTokenExist_;
    /**
     * Function to patse the JWT
     *
     * @param token - JWT to purse
     * @returns Parsed data from JWT
     */
    private parseJwt;
    /**
     * Get the Expire Date from JWT
     *
     * @param token - JWT from which to get the Expire time
     * @returns Expire Date
     *
     * @remarks
     * Get `exp` param from the JWT data payload and convert that to Date
     */
    private getExpireDateTime;
    /**
     * Sync Auth Tokens on time of login and logout
     *
     * Set the New Cookies or new Localstorage on login
     * Or Remove the old Cookies or old Localstorage on logout
     *
     * @param authState - Current Auth State
     */
    syncTokens: (authState: AuthKitStateInterface<T>) => void;
    private setAuthToken;
    private setRefreshToken;
    /**
     * Remove Tokens on time of Logout
     */
    private removeAllToken;
    /**
     * Remove Token from Cookies
     */
    private removeAllCookieToken_;
    /**
     * Remove Token from LocalStorage
     */
    private removeAllLSToken_;
    /**
     * Remove Tokens on time of Logout
     */
    private removeAuth;
    /**
     * Remove Token from Cookies
     */
    private removeAuthCookie;
    /**
     * Remove Token from LocalStorage
     */
    private removeAuthToken;
    /**
     * Remove Tokens on time of Logout
     */
    private removeRefresh;
    /**
     * Remove Token from Cookies
     */
    private removeRefreshCookie;
    /**
     * Remove Token from LocalStorage
     */
    private removeRefreshLocalStorage;
    /**
     * Log function
     * @param msg - The Message to log to the console
     */
    private log;
}
export default TokenObject;
