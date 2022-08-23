// @flow
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    openViewEventPage,
    requestDeleteEvent,
} from '../eventWorkingLists.actions';
import { EventWorkingListsColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagement } from '../../WorkingListsCommon';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './eventWorkingListsReduxProvider.types';
import { computeDownloadRequest } from './downloadRequest';
import { convertToClientConfig } from '../helpers/eventFilters';

export const EventWorkingListsReduxProvider = ({ storeId, orgUnitId }: Props) => {
    const dispatch = useDispatch();

    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const program = useMemo(() => getEventProgramThrowIfNotFound(programId),
        [programId]);

    const { currentTemplateId, templates, onLoadView, onUpdateList, ...commonStateManagementRestProps }
        = useWorkingListsCommonStateManagement(storeId, SINGLE_EVENT_WORKING_LISTS_TYPE, program);

    const currentTemplate = currentTemplateId && templates &&
    templates.find(template => template.id === currentTemplateId);

    const lastEventIdDeleted = useSelector(({ workingListsUI }) =>
        workingListsUI[storeId] && workingListsUI[storeId].lastEventIdDeleted);

    const downloadRequest = useSelector(({ workingLists }) =>
        workingLists[storeId] && workingLists[storeId].currentRequest); // TODO: Remove when DownloadDialog is rewritten

    const onSelectListRow = useCallback(({ id }) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(id));
    }, [dispatch]);

    const onDeleteEvent = useCallback((eventId: string) => {
        dispatch(requestDeleteEvent(eventId, storeId));
    }, [dispatch, storeId]);

    const injectDownloadRequestToLoadView = useCallback(
        async (selectedTemplate: Object, context: Object, meta: Object) => {
            const eventQueryCriteria = selectedTemplate?.nextCriteria || selectedTemplate?.criteria;
            const clientConfig = await convertToClientConfig(eventQueryCriteria, meta?.columnsMetaForDataFetching);
            const currentRequest = computeDownloadRequest({
                clientConfig,
                context: {
                    programId: context.programId,
                    categories: context.categories,
                    orgUnitId,
                    storeId,
                    program,
                },
                meta: { columnsMetaForDataFetching: meta.columnsMetaForDataFetching },
            });
            return onLoadView(selectedTemplate, { ...context, currentRequest }, meta);
        },
        [onLoadView, orgUnitId, storeId, program],
    );

    const injectDownloadRequestToUpdateList = useCallback(
        (queryArgs: Object, meta: Object) => {
            const { lastTransaction, columnsMetaForDataFetching } = meta;
            const currentRequest = computeDownloadRequest({
                clientConfig: queryArgs,
                context: {
                    programId: queryArgs.programId,
                    categories: queryArgs.categories,
                    orgUnitId,
                    storeId,
                    program,
                },
                meta: { columnsMetaForDataFetching },
            });
            return onUpdateList(queryArgs, { ...meta, currentRequest }, lastTransaction);
        },
        [onUpdateList, orgUnitId, storeId, program],
    );

    return (
        <EventWorkingListsColumnSetup
            {...commonStateManagementRestProps}
            program={program}
            currentTemplate={currentTemplate}
            templates={templates}
            lastIdDeleted={lastEventIdDeleted}
            onSelectListRow={onSelectListRow}
            onLoadView={injectDownloadRequestToLoadView}
            onUpdateList={injectDownloadRequestToUpdateList}
            onDeleteEvent={onDeleteEvent}
            downloadRequest={downloadRequest}
        />
    );
};
