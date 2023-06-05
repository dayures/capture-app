// @flow
import type { LinkedRecordClick } from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship';

export type Props = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    onAddRelationship: () => void,
    addRelationshipRenderElement: HTMLDivElement,
    onOpenAddRelationship: () => void,
    onCloseAddRelationship: () => void,
    onLinkedRecordClick: LinkedRecordClick,
|};
