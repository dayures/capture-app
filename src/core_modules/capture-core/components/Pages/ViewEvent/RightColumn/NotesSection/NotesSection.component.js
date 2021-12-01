// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconMessages24 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { Notes } from '../../../../Notes/Notes.component';
import type { ProgramStage } from '../../../../../metaData';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';

const LoadingNotes = withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Notes);

type Props = {
    classes: Object,
    notes: ?Array<any>,
    onAddNote: () => void,
    onUpdateNoteField: (value: string) => void,
    fieldValue: ?string,
    ready: boolean,
    programStage: ProgramStage,
    eventAccess: any,
}

const loadingIndicatorStyle = {
    height: 36,
    width: 36,
};

const headerText = i18n.t('Comments');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey.light,
    },
    note: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey.lighter,
    },
});

class NotesSectionPlain extends React.Component<Props> {
    renderHeader = () => {
        const { classes, notes, ready } = this.props;
        let count = notes ? notes.length : 0;
        count = ready ? count : null;
        return (
            <ViewEventSectionHeader
                icon={IconMessages24}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    render() {
        const { notes, fieldValue, onAddNote, ready, programStage, eventAccess } = this.props;
        return (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                <LoadingNotes
                    loadingIndicatorStyle={loadingIndicatorStyle}
                    ready={ready}
                    notes={notes}
                    entityAccess={eventAccess}
                    addNotAllowed={!programStage.stageForm.access.data.write}
                    onAddNote={onAddNote}
                    onBlur={this.props.onUpdateNoteField}
                    value={fieldValue}
                    smallMainButton
                />
            </ViewEventSection>
        );
    }
}

export const NotesSectionComponent = withStyles(getStyles)(NotesSectionPlain);
