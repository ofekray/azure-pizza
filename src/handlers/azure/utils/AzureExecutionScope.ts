import * as asyncHooks from "async_hooks";
import { Context } from "@azure/functions";

const contexts: { [key: string]: Context } = {};

// Create a new Async Hook to capture life-time events of Async Resources
asyncHooks.createHook({
    init: (asyncId, type, triggerId) => {
        if (contexts[triggerId]) {
            contexts[asyncId] = contexts[triggerId];
        }
    },
    destroy: (asyncId) => {
        delete contexts[asyncId];
    },
}).enable();

export async function runInAsyncScope<T>(requestContext: Context, fn: () => T) {
    const asyncResource = new asyncHooks.AsyncResource('REQUEST_CONTEXT'); // Create a new Async Resource for our code to run in
    return asyncResource.runInAsyncScope(() => {
        const asyncId = asyncHooks.executionAsyncId(); // Get the asyncId of the new Async Resource we created
        contexts[asyncId] = requestContext; // Assign the requestContext to our contexts registry
        return fn(); // Run the code inside our async scope
    });
}

export function getRequestContext(): Context {
    const asyncId = asyncHooks.executionAsyncId();
    const requestContext: Context = contexts[asyncId];
    return requestContext ? {... requestContext} : requestContext; // Make sure requestContext is immutable
}