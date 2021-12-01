// @flow
import React, { useState, useMemo, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { EventWorkingListsRowMenuSetup } from '../RowMenuSetup';
import type { CustomMenuContents } from '../../WorkingListsBase';
import type { Props } from './EventWorkingListsViewMenuSetup.types';
import { DownloadDialog } from './DownloadDialog';

export const EventWorkingListsViewMenuSetup = ({ downloadRequest, program, programStageId, ...passOnProps }: Props) => {
    const [downloadDialogOpen, setDownloadDialogOpenStatus] = useState(false);
    const customListViewMenuContents: CustomMenuContents = useMemo(() => [{
        key: 'downloadData',
        clickHandler: () => setDownloadDialogOpenStatus(true),
        element: i18n.t('Download data...'),
    }], [setDownloadDialogOpenStatus]);

    const handleCloseDialog = useCallback(() => {
        setDownloadDialogOpenStatus(false);
    }, [setDownloadDialogOpenStatus]);

    return (
        <React.Fragment>
            <EventWorkingListsRowMenuSetup
                {...passOnProps}
                programStageId={programStageId}
                programId={program.id}
                customListViewMenuContents={customListViewMenuContents}
            />
            <DownloadDialog
                open={downloadDialogOpen}
                onClose={handleCloseDialog}
                request={downloadRequest}
                programStageId={programStageId}
            />
        </React.Fragment>
    );
};
