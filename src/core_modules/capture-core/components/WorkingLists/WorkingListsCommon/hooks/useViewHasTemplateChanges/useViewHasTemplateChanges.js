// @flow
import { useMemo } from 'react';
import { areFiltersEqual } from '../../../WorkingListsBase';
import type { Input, InitialViewConfigComputed, CurrentViewConfig } from './useViewHasTemplateChanges.types';

const isCurrentViewModified = ({
    filters,
    columns,
    sortById,
    sortByDirection,
}: CurrentViewConfig, {
    filters: initialFilters,
    visibleColumnIds: initialVisibleColumnIds,
    sortById: initialSortById,
    sortByDirection: initialSortByDirection,
}: InitialViewConfigComputed,
) => {
    if (sortById !== initialSortById || sortByDirection !== initialSortByDirection) {
        return true;
    }

    const visibleColumnIds = columns
        .filter(c => c.visible)
        .map(c => c.id);

    if (visibleColumnIds.length !== initialVisibleColumnIds.length) {
        return true;
    }

    if (visibleColumnIds.some((columnId, index) => columnId !== initialVisibleColumnIds[index])) {
        return true;
    }

    return !areFiltersEqual(initialFilters, filters);
};

export const useViewHasTemplateChanges = ({
    initialViewConfig,
    defaultColumns,
    filters,
    columns,
    sortById,
    sortByDirection,
    programStage,
}: Input) => {
    const calculatedInitialViewConfig = useMemo(() => {
        if (!initialViewConfig) {
            return initialViewConfig;
        }

        // DHIS2-13751 the API to interact with a programStage working list template doesn't exist yet
        // Disable for now viewHasChanges and the working list buttons when the programStage filter is active.
        if (programStage) {
            return false;
        }

        const visibleColumnIds = initialViewConfig.customVisibleColumnIds || defaultColumns
            .filter(defaultColumn => defaultColumn.visible)
            .map(defaultColumn => defaultColumn.id);

        return {
            ...initialViewConfig,
            customVisibleColumnIds: undefined,
            visibleColumnIds,
        };
    }, [initialViewConfig, defaultColumns, programStage]);

    const viewHasChanges = useMemo(() => {
        if (!calculatedInitialViewConfig) {
            return undefined;
        }

        // $FlowFixMe If calculatedInitialViewConfig is set, the Redux State logic ensures filters, columns, sortById and sortByDirection are all defined.
        return isCurrentViewModified({ filters, columns, sortById, sortByDirection }, calculatedInitialViewConfig);
    }, [
        filters,
        columns,
        sortById,
        sortByDirection,
        calculatedInitialViewConfig,
    ]);

    return viewHasChanges;
};
