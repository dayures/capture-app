// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ColumnsMetaForDataFetching } from '../types';
import {
    updateListSuccess,
    updateListError,
    buildFilterQueryArgs,
} from '../../WorkingListsCommon';
import { getEventListData } from './getEventListData';


const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

export const updateEventWorkingListAsync = (
    queryArgsSource: Object, {
        columnsMetaForDataFetching,
        categoryCombinationId,
        storeId,
    }: {
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    categoryCombinationId?: ?string,
    storeId: string,
}): Promise<ReduxAction<any, any>> => {
    const rawQueryArgs = {
        ...queryArgsSource,
        fields: 'dataValues,eventDate,event,status,orgUnit,program,programType,lastUpdated,created,assignedUser,assignedUserDisplayName,assignedUserUsername',
        filters: buildFilterQueryArgs(queryArgsSource.filters, {
            columns: columnsMetaForDataFetching,
            storeId,
        }),
    };

    return getEventListData(rawQueryArgs, columnsMetaForDataFetching, categoryCombinationId)
        .then(({ eventContainers, pagingData, request }) =>
            updateListSuccess(storeId, {
                recordContainers: eventContainers,
                pagingData,
                request,
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return updateListError(storeId, errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};
