// @flow
import type { WorkingListTemplate, AddTemplate, UpdateTemplate, DeleteTemplate, SetTemplateSharingSettings } from '../workingListsBase.types';
import type { ListViewConfigOutputProps } from '../ListViewConfig';
import type { CustomMenuContents } from '../../../ListView';

type ExtractedProps = {|
    currentTemplate: WorkingListTemplate,
    onAddTemplate?: AddTemplate,
    onUpdateTemplate?: UpdateTemplate,
    onDeleteTemplate?: DeleteTemplate,
    onSetTemplateSharingSettings?: SetTemplateSharingSettings,
    currentViewHasTemplateChanges: boolean,
    customListViewMenuContents?: CustomMenuContents,
    classes: Object,
|};

type OptionalExtractedProps = {|
    onAddTemplate: AddTemplate,
    onUpdateTemplate: UpdateTemplate,
    onDeleteTemplate: DeleteTemplate,
    onSetTemplateSharingSettings: SetTemplateSharingSettings,
|};

type RestProps = $Rest<ListViewConfigOutputProps & OptionalExtractedProps, ExtractedProps & OptionalExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
export type ListViewConfigMenuContentOutputProps = {|
    ...RestProps,
    currentTemplate: WorkingListTemplate,
    customListViewMenuContents?: CustomMenuContents,
|};
