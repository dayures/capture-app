// @flow

import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { config } from 'd2';
import { actionTypes as NavigateToEnrollmentOverviewActionTypes } from './navigateToEnrollmentOverview.actions';
import { deriveURLParamsFromLocation } from '../../utils/routing';
import { scopeHierarchyTypes } from './navigateToEnrollmentOverview.constants';

// TODO This will be removed when the link between capture and tracker capture is not relevant
const redirectToTracker = ({ teiId, orgUnitId, dependencies }) => {
    const { baseUrl } = config;
    const { search, pathname } = dependencies.history.location;
    const { programId: queryProgramId, trackedEntityTypeId: queryTrackedEntityTypeId } = deriveURLParamsFromLocation();

    const instanceBaseUrl = baseUrl.split('/api')[0];
    const scopeHierarchy = queryProgramId ? scopeHierarchyTypes.PROGRAM : scopeHierarchyTypes.TRACKED_ENTITY_TYPE;
    const selectedScopeId = queryTrackedEntityTypeId || queryProgramId;
    const scopeSearchParam = `${scopeHierarchy.toLowerCase()}=${selectedScopeId}`;
    const base64Url = btoa(`/dhis-web-capture/#${pathname}${search}`);
    setTimeout(() => {
        window.location.href = `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}&returnUrl=${base64Url}`;
    }, 50);
};

export const navigateToEnrollmentOverviewEpic = (action$: InputObservable, store: ReduxStore, dependencies: any) =>
    action$.pipe(
        ofType(NavigateToEnrollmentOverviewActionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW),
        switchMap((action) => {
            const { teiId, programId } = action.payload;
            const orgUnitId =
                action.payload.orgUnitId ||
                store.value.workingListsListRecords?.teiList[teiId]?.programOwners[programId]?.ownerOrgUnit;
            redirectToTracker({ dependencies, teiId, orgUnitId });
            return EMPTY;
        }),
    );
