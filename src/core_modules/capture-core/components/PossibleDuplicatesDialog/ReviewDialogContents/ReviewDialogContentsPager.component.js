// @flow
import React, { type ComponentType } from 'react';
import { Pagination } from 'capture-ui';
import { withStyles } from '@material-ui/core/styles';
import { useDuplicates } from '../useDuplicates';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import type { Props } from './ReviewDialogContentsPager.types';

const Pager = withNavigation()(Pagination);

const getStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(600),
    },
});

const ReviewDialogContentsPagerPlain = ({
    currentPage,
    nextPageButtonDisabled,
    selectedScopeId,
    dataEntryId,
    classes,
}: Props) => {
    const { changePageOnReviewDuplicates } = useDuplicates(dataEntryId, selectedScopeId);

    return (
        <div
            className={classes.container}
        >
            <Pager
                currentPage={currentPage}
                onChangePage={changePageOnReviewDuplicates}
                nextPageButtonDisabled={nextPageButtonDisabled}
            />
        </div>
    );
};

export const ReviewDialogContentsPagerComponent: ComponentType<$Diff<Props, CssClasses>> =
  withStyles(getStyles)(ReviewDialogContentsPagerPlain);
