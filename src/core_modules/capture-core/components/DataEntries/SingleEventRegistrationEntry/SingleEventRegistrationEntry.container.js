// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { type ComponentType } from 'react';
import { defaultDialogProps as dialogConfig } from '../../Dialogs/ConfirmDialog.constants';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { withLoadingIndicator } from '../../../HOC';
import { makeEventAccessSelector } from './SingleEventRegistrationEntry.selectors';
import { SingleEventRegistrationEntryComponent } from './SingleEventRegistrationEntry.component';

const inEffect = (state: ReduxState) => dataEntryHasChanges(state, 'singleEvent-newEvent') || state.newEventPage.showAddRelationship;

const makeMapStateToProps = () => {
    const eventAccessSelector = makeEventAccessSelector();
    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState, { id }) => ({
        ready: state.dataEntries[id],
        showAddRelationship: !!state.newEventPage.showAddRelationship,
        eventAccess: eventAccessSelector(state),
    });
};

const mapDispatchToProps = () => ({
});

export const SingleEventRegistrationEntry: ComponentType<{| id: string |}> =
  compose(
      connect(makeMapStateToProps, mapDispatchToProps),
      withLoadingIndicator(),
      withBrowserBackWarning(dialogConfig, inEffect),
  )(SingleEventRegistrationEntryComponent);
