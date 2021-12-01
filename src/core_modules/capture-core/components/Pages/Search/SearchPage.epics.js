// @flow
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { topBarActionsActionTypes } from '../../TopBarActions';
import { lockedSelectorActionTypes } from '../../LockedSelector';
import { deriveUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';
import { searchPageActionTypes } from './SearchPage.actions';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            return push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
        }),
    );

export const openSearchPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.SEARCH_PAGE_OPEN, topBarActionsActionTypes.SEARCH_PAGE_OPEN),
        map(() => {
            const { programId, orgUnitId } = deriveUrlQueries(store.value);
            return push(`/search?${buildUrlQueryString({ programId, orgUnitId })}`);
        }));
