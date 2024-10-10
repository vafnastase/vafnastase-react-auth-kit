import type { Context } from 'react';
import type Router from './route';
import type TokenObject from './RxTokenObject';
interface ReactAuthKitContextConfig {
    fallbackPath?: string;
}
interface ReactAuthKitContext<T> {
    token: TokenObject<T>;
    router?: Router;
    config: ReactAuthKitContextConfig;
}
declare const AuthKitContext: Context<ReactAuthKitContext<unknown>>;
/**
 *
 * @internal
 * @returns TokenObject from the context
 *
 * React Context consumer to globally hold the
 * TokenObject instance in the application.
 *
 */
export declare function useReactAuthKit(): TokenObject<unknown>;
/**
 *
 * @internal
 * @returns Router Object from the context
 *
 */
export declare function useReactAuthKitRouter(): Router | undefined;
/**
 * @internal
 * @returns React Auth Kit configurations
 */
export declare function useReactAuthKitConfig(): ReactAuthKitContextConfig;
export default AuthKitContext;
