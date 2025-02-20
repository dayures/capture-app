// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { actionTypes as viewEventRelationshipsActionTypes } from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
import {
    actionTypes as viewEventDetailsActionTypes,
} from '../../components/Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import {
    actionTypes as viewEventDataEntryActionTypes,
} from '../../components/WidgetEventEdit/ViewEventDataEntry/viewEventDataEntry.actions';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';
import { actionTypes as viewEventNotesActionTypes } from '../../components/Pages/ViewEvent/Notes/viewEventNotes.actions';
import { eventWorkingListsActionTypes } from '../../components/WorkingLists/EventWorkingLists';
import {
    actionTypes as widgetEventEditActionTypes,
} from '../../components/WidgetEventEdit/WidgetEventEdit.actions';
import { enrollmentEditEventActionTypes } from '../../components/Pages/EnrollmentEditEvent';

const setAssignee = (state, action) => {
    const { assignee, eventId } = action.payload;
    if (eventId !== state.eventId) {
        return state;
    }

    const newState = {
        ...state,
        saveInProgress: true,
        loadedValues: {
            ...state.loadedValues,
            eventContainer: {
                ...state.loadedValues.eventContainer,
                event: {
                    ...state.loadedValues.eventContainer.event,
                    assignee,
                },
            },
        },
    };

    return newState;
};

export const viewEventPageDesc = createReducerDescription({
    [viewEventActionTypes.VIEW_EVENT_FROM_URL]: (state, action) => {
        const newState = {
            eventDetailsSection: {},
            notesSection: { isLoading: true },
            relationshipsSection: { isLoading: true },
            assigneeSection: { isLoading: true },
            eventId: action.payload.eventId,
        };
        return newState;
    },
    [viewEventDataEntryActionTypes.VIEW_EVENT_DATA_ENTRY_LOADED]: (state, action) => {
        const newState = { ...state };
        newState.eventDetailsSection = {
            ...newState.eventDetailsSection,
        };
        newState.loadedValues = action.payload.loadedValues;
        newState.assigneeSection = {
            isLoading: false,
            assignee: action.payload.assignee,
        };
        return newState;
    },
    [viewEventDataEntryActionTypes.PREREQUISITES_ERROR_LOADING_VIEW_EVENT_DATA_ENTRY]: (state, action) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        newState.dataEntryLoadError = action.payload;
        return newState;
    },
    [eventWorkingListsActionTypes.VIEW_EVENT_PAGE_OPEN]: (state, { payload: { eventId } }) => {
        const newState = {
            eventDetailsSection: {},
            notesSection: { isLoading: true },
            relationshipsSection: { isLoading: true },
            assigneeSection: { isLoading: true },
            eventId,
        };
        return newState;
    },
    [viewEventActionTypes.VIEW_EVENT_OPEN_NEW_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: true,
    }),
    [viewEventRelationshipsActionTypes.EVENT_RELATIONSHIPS_LOADED]: state => ({
        ...state,
        relationshipsSection: {
            ...state.relationshipsSection,
            isLoading: false,
        },
    }),
    [viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: false,
    }),
    [viewEventRelationshipsActionTypes.EVENT_CANCEL_NEW_RELATIONSHIP]: (state) => {
        const newState = { ...state };
        newState.showAddRelationship = false;
        return newState;
    },
    [viewEventNotesActionTypes.EVENT_NOTES_LOADED]: state => ({
        ...state,
        notesSection: {
            ...state.notesSection,
            isLoading: false,
        },
    }),
    [viewEventNotesActionTypes.UPDATE_EVENT_NOTE_FIELD]: (state, action) => ({
        ...state,
        notesSection: {
            ...state.notesSection,
            fieldValue: action.payload.value,
        },
    }),
    [viewEventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY]: state => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
        },
    }),
    [widgetEventEditActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY]: state => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
        },
    }),
    [viewEventDetailsActionTypes.SHOW_EDIT_EVENT_DATA_ENTRY]: state => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
            showEditEvent: true,
        },
    }),
    [editEventDataEntryActionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY]: state => ({
        ...state,
        eventDetailsSection: {
            ...state.eventDetailsSection,
            showEditEvent: false,
        },
    }),
    [editEventDataEntryActionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY]: state => ({
        ...state,
        saveInProgress: true,
        eventDetailsSection: {
            ...state.eventDetailsSection,
            showEditEvent: false,
        },
    }),
    [editEventDataEntryActionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED]: (state, action) => {
        if (action.meta.eventId !== state.eventId) {
            return state;
        }
        return {
            ...state,
            saveInProgress: false,
        };
    },
    [editEventDataEntryActionTypes.EDIT_EVENT_DATA_ENTRY_SAVED]: (state, action) => {
        if (action.meta.eventId !== state.eventId) {
            return state;
        }
        return {
            ...state,
            saveInProgress: false,
            eventHasChanged: true,
        };
    },
    [viewEventActionTypes.ASSIGNEE_SET]: setAssignee,
    [viewEventActionTypes.ASSIGNEE_SAVE_FAILED]: setAssignee,
    [enrollmentEditEventActionTypes.ASSIGNEE_SET]: setAssignee,
    [enrollmentEditEventActionTypes.ASSIGNEE_SAVE_FAILED]: setAssignee,
}, 'viewEventPage');
