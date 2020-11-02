// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withFilters } from './withFilters';
import { ListPagination } from '../Pagination';
import { ColumnSelector } from '../ColumnSelector';
import { withEndColumnMenu } from '../withEndColumnMenu';
import DialogLoadingMask from '../../LoadingMasks/DialogLoadingMask.component';
import { OnlineList } from '../../List';
import { ListViewMenu } from '../Menu';
import type { Columns, DataSource } from '../types';

const ListWithEndColumnMenu = withEndColumnMenu()(OnlineList);

const getStyles = (theme: Theme) => ({
    topBarContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.typography.pxToRem(8),
    },
    topBarLeftContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    topBarButtonContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    paginationContainer: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

type Props = {
    dataSource: DataSource,
    columns: Columns,
    classes: Object,
    filters: React.Node,
    isUpdatingWithDialog?: ?boolean,
    onSetColumnOrder: Function,
    rowIdKey: string,
    customMenuContents?: Array<Object>,
};

class ListViewMainPlain extends React.PureComponent<Props> {
    renderTopBar = () => {
        const { classes, filters, columns, customMenuContents, onSetColumnOrder } = this.props;
        return (
            <div
                className={classes.topBarContainer}
            >
                <div
                    className={classes.topBarLeftContainer}
                >
                    {filters}
                </div>
                <div
                    className={classes.topBarButtonContainer}
                >
                    <ColumnSelector
                        onSave={onSetColumnOrder}
                        columns={columns}
                    />
                    <ListViewMenu
                        customMenuContents={customMenuContents}
                    />
                </div>
            </div>
        );
    }

    renderPager = () => {
        const classes = this.props.classes;
        return (
            <div
                className={classes.paginationContainer}
            >
                <ListPagination />
            </div>
        );
    }

    renderList = () => {
        const {
            classes,
            filters,
            isUpdatingWithDialog,
            ...passOnProps
        } = this.props;
        return (
            <ListWithEndColumnMenu
                {...passOnProps}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderTopBar()}
                {this.renderList()}
                {this.renderPager()}
                {this.props.isUpdatingWithDialog && <DialogLoadingMask />}
            </div>
        );
    }
}

export const ListViewMain = withFilters()(withStyles(getStyles)(ListViewMainPlain));
