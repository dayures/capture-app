// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { spacersNum, spacers, colors, Button } from '@dhis2/ui';
import { RelationshipTable } from './RelationshipTable';

type Props = {
    relationshipsByType: Object,
    headersByType: Object,
    onAddRelationship: void,
    ...CssClasses,
}

const styles = {
    container: {
        padding: `${spacers.dp8} ${spacers.dp16}`,
    },
    title: {
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
        paddingBottom: spacersNum.dp8,
    },
    wrapper: {
        paddingBottom: spacersNum.dp16,
        overflow: 'scroll',
    },
};
const RelationshipsPlain = ({ relationshipsByType, headersByType, classes, onAddRelationship }: Props) => (
    <div
        data-test="relationships"
        className={classes.container}
    >
        {
            relationshipsByType ? relationshipsByType.map((relationship) => {
                const { relationshipName, id, ...passOnProps } = relationship;
                return (<div key={id} className={classes.wrapper}>
                    <div className={classes.title} >{relationshipName}</div>
                    <RelationshipTable headers={headersByType[id]} {...passOnProps} />
                </div>);
            }) : null
        }
        <Button onClick={onAddRelationship}>
            {i18n.t('Add relationship')}
        </Button>
    </div>);

export const Relationships: ComponentType<Props> = withStyles(styles)(RelationshipsPlain);
