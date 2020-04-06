// @flow
import { quickStore } from './quickStore';
import type {
    ApiQuery,
    StoreName,
    ConvertFn,
    GetResultLengthFn,
    QuickStoreRecursivelyOptions,
} from './IOUtils.types';

type ExecuteOptions = {
    onConvert?: ConvertFn,
    iterationSize: number,
    iteration?: number,
};

type Variables = {
    iteration: number,
};

type RecursiveQuery = {
    ...ApiQuery,
    params?: (variables: Variables) => Object,
};

type QuickStoreIterationOptions = {
    variables: Variables,
    onConvert?: ConvertFn,
    onGetResultLength?: GetResultLengthFn,
};

const quickStoreIteration = async (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    {
        variables,
        onConvert,
    }: QuickStoreIterationOptions,
) => {
    const { rawResponse } = await quickStore(recursiveQuery, storeName, {
        onConvert,
        variables,
    });

    return !(rawResponse && rawResponse.pager && rawResponse.pager.nextPage);
};

const executeRecursiveQuickStore = (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    {
        onConvert,
    }: ExecuteOptions) => {
    const next = async (iteration: number = 1) => {
        const done = await quickStoreIteration(recursiveQuery, storeName, {
            onConvert,
            variables: {
                iteration,
            },
        });

        if (!done) {
            await next(iteration + 1);
        }
    };

    return next();
};

const getRecursiveQuery = (query: ApiQuery, iterationSize: number) => ({
    ...query,
    params: (variables: Variables) => ({
        ...query.params,
        pageSize: iterationSize,
        page: variables.iteration,
    }),
});

export const quickStoreRecursively = async (
    query: ApiQuery,
    storeName: StoreName,
    {
        iterationSize = 500,
        onConvert,
        onGetResultLength,
    }: QuickStoreRecursivelyOptions) => {
    const recursiveQuery = getRecursiveQuery(query, iterationSize);
    await executeRecursiveQuickStore(recursiveQuery, storeName, {
        onConvert,
        onGetResultLength,
        iterationSize,
    });
};
