// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { DropdownButton, FlyoutMenu, MenuDivider, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { LoadingMaskForButton } from '../../LoadingMasks';
import { Followup } from './Followup';
import { Delete } from './Delete';
import { Complete } from './Complete';
import { Cancel } from './Cancel';
import type { PlainProps } from './actions.types';

const styles = {
    actions: {
        margin: spacersNum.dp4,
    },
    loading: {
        display: 'flex',
        margin: spacersNum.dp8,
        alignItems: 'center',
    },
};

export const ActionsPlain = ({
    enrollment = {},
    onUpdate,
    onDelete,
    loading,
    classes,
}: PlainProps) => (
    <>
        <DropdownButton
            dataTest="widget-enrollment-actions-button"
            secondary
            small
            disabled={loading}
            className={classes.actions}
            component={
                <span>
                    {loading ? null : (
                        <FlyoutMenu dense maxWidth="250px">
                            <Complete
                                enrollment={enrollment}
                                onUpdate={onUpdate}
                            />
                            <Followup
                                enrollment={enrollment}
                                onUpdate={onUpdate}
                            />
                            <MenuDivider />
                            <Cancel
                                enrollment={enrollment}
                                onUpdate={onUpdate}
                            />
                            <Delete
                                enrollment={enrollment}
                                onDelete={onDelete}
                            />
                        </FlyoutMenu>
                    )}
                </span>
            }
        >
            {i18n.t('Enrollment actions')}
        </DropdownButton>
        {loading && (
            <div className={classes.loading}>
                <LoadingMaskForButton />
                &nbsp;
                {i18n.t('We are processing your request.')}
            </div>
        )}
    </>
);

export const ActionsComponent: ComponentType<$Diff<PlainProps, CssClasses>> =
    withStyles(styles)(ActionsPlain);
