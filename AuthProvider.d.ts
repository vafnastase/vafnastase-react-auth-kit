import * as React from 'react';
import Router from './route';
import type { createStoreReturn } from './createStore';
/**
 * Props of the AuthProvider Component
 */
interface AuthProviderProps<T> {
    /**
     * Auth Kit Store.
     *
     * Create the store using the `createStore` function
     */
    store: createStoreReturn<T>;
    /**
     * Auth Kit Router.
     *
     * Internally used to redirect after signin and token expiration
     */
    router?: Router;
    /**
     * Fallback Path
     * The path to redirect if signed out
     */
    fallbackPath?: string;
    /**
     * React Component.
     * Effectively your entine application
     */
    children: React.ReactNode;
}
/**
 *
 * React Provider that includes React Auth Kit functionality in your React
 * Application.
 *
 * @returns React Functional component with React Auth Kit Recharged.
 *
 * @remarks
 * Make sure you wrap your application as well as your
 * router components in AuthProvider.
 *
 * AuthProvider should be your Topmost element so that it can work effectively
 * throughout the application.
 *
 * @example
 * ```jsx
 * import ReactRouterPlugin from '@auth-kit/react-router/route'
 *
 * const store = createStore()
 *
 * <AuthProvider store={store} router={ReactRouterPlugin} fallbackPath='/login'>
 *  <RoutesComponent/>
 * </AuthProvider>
 * ```
 *
 */
declare function AuthProvider<T>({ store, router, fallbackPath, children, }: AuthProviderProps<T>): ReturnType<React.FC>;
export default AuthProvider;
