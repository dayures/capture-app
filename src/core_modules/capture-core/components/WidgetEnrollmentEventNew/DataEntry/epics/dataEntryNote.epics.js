// @flow
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import moment from 'moment';
import uuid from 'd2-utilizr/lib/uuid';
import {
    newEventWidgetDataEntryActionTypes,
} from '../actions/dataEntry.actions';
import {
    addNote,
} from '../../../DataEntry/actions/dataEntry.actions';
import { dataElementTypes } from '../../../../metaData';
import { getCurrentUser } from '../../../../d2/d2Instance';
import { convertValue as convertListValue } from '../../../../converters/clientToList';


export const addNoteForNewEnrollmentEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventWidgetDataEntryActionTypes.EVENT_NOTE_ADD),
        map((action) => {
            const payload = action.payload;
            // $FlowFixMe[prop-missing] automated comment
            const userName = getCurrentUser().username;

            const storedDate = moment().toISOString();
            const note = {
                value: payload.note,
                storedBy: userName,
                storedDate: convertListValue(storedDate, dataElementTypes.DATETIME),
                clientId: uuid(),
            };

            return addNote(payload.dataEntryId, payload.itemId, note);
        }));
