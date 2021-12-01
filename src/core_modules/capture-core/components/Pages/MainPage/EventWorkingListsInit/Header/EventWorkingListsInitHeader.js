// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './eventWorkingListsInitHeader.types';

const getStyles = ({ typography, palette }) => ({
    headerContainer: {
        padding: typography.pxToRem(24),
        borderColor: palette.type === 'light'
            ? palette.dividerLighter
            : palette.dividerDarker,
        borderWidth: '0 0 1px 0',
        borderStyle: 'solid',
    },
    listContainer: {
        padding: typography.pxToRem(24),
    },
    title: {
        ...typography.title,
    },
});

const EventWorkingListsInitHeaderPlain =
    ({ children, classes: { headerContainer, listContainer, title } }: Props) => (
        <Paper>
            <div
                className={headerContainer}
            >
                <span
                    className={title}
                >
                    {i18n.t('Registered events')}
                </span>
            </div>
            <div
                className={listContainer}
            >
                {children}
            </div>
        </Paper>
    );

export const EventWorkingListsInitHeader: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(EventWorkingListsInitHeaderPlain);
