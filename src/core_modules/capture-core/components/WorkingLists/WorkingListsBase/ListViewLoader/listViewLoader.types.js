// @flow
import type {
    ColumnConfigs,
    Categories,
    UpdateList,
    WorkingListTemplate,
} from '../workingListsBase.types';
import type { ListViewConfigMenuContentOutputProps } from '../ListViewConfigMenuContent';
import type { FiltersData } from '../../../ListView';

type ExtractedProps = {|
    currentTemplate: WorkingListTemplate,
    programId: string,
    programStageId?: string,
|};

type RestProps = $Rest<ListViewConfigMenuContentOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type ListViewLoaderOutputProps = {|
    ...RestProps,
    sortById: string,
    sortByDirection: string,
    filters: FiltersData,
    columns: ColumnConfigs,
    programId: string,
    orgUnitId: string,
    categories?: Categories,
    onUpdateList: UpdateList,
    viewLoadedOnFirstRun: boolean,
|};
