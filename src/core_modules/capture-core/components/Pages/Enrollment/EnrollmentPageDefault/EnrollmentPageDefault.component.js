// @flow
import React, { type ComponentType, useRef, useEffect, useState, useCallback } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { WidgetStagesAndEvents } from '../../../WidgetStagesAndEvents';
import { WidgetEnrollment } from '../../../WidgetEnrollment';
import { WidgetProfile } from '../../../WidgetProfile';
import type { Props, PlainProps } from './EnrollmentPageDefault.types';
import { WidgetWarning } from '../../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../../WidgetFeedback';
import { WidgetError } from '../../../WidgetErrorAndWarning/WidgetError';
import { WidgetIndicator } from '../../../WidgetIndicator';
import { WidgetEnrollmentComment } from '../../../WidgetEnrollmentComment';
import { EnrollmentQuickActions } from './EnrollmentQuickActions';
import { TrackedEntityRelationshipsWrapper } from './TrackedEntityRelationshipsWrapper';

const getStyles = () => ({
    container: {
        position: 'relative',
    },
    columns: {
        display: 'flex',
    },
    leftColumn: {
        flexGrow: 3,
        flexShrink: 1,
        width: 872,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        paddingLeft: spacersNum.dp16,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
    title: {
        fontSize: '1.25rem',
        color: colors.grey900,
        fontWeight: 500,
        paddingTop: spacersNum.dp8,
        paddingBottom: spacersNum.dp16,
    },
});

export const EnrollmentPageDefaultPlain = ({
    program,
    teiId,
    orgUnitId,
    events,
    enrollmentId,
    stages,
    onDelete,
    onAddNew,
    onViewAll,
    onCreateNew,
    widgetEffects,
    hideWidgets,
    classes,
    onEventClick,
    onUpdateTeiAttributeValues,
    onEnrollmentError,
}: PlainProps) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] = useState(undefined);
    const renderRelationshipRef = useRef();

    useEffect(() => {
        setAddRelationshipContainerElement(renderRelationshipRef.current);
    }, []);

    const a = (c, d, e) => {
        debugger;
        onEventClick(c,d,e);
    };

    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);

    return (
        <>
            <div
                ref={renderRelationshipRef}
            />
            <div
                className={classes.container}
                style={!mainContentVisible ? { display: 'none' } : undefined}
            >
                <div className={classes.title}>{i18n.t('Enrollment Dashboard')}</div>
                <div className={classes.columns}>
                    <div className={classes.leftColumn}>
                        <EnrollmentQuickActions
                            stages={stages}
                            events={events}
                        />
                        <WidgetStagesAndEvents
                            stages={stages}
                            events={events}
                            onViewAll={onViewAll}
                            onCreateNew={onCreateNew}
                            onEventClick={a}
                        />
                    </div>
                    <div className={classes.rightColumn}>
                        {addRelationShipContainerElement &&
                            <TrackedEntityRelationshipsWrapper
                                trackedEntityTypeId={program.trackedEntityType.id}
                                programId={program.id}
                                addRelationshipRenderElement={addRelationShipContainerElement}
                                onOpenAddRelationship={toggleVisibility}
                                onCloseAddRelationship={toggleVisibility}
                            />
                        }
                        <WidgetEnrollmentComment />
                        <WidgetError error={widgetEffects?.errors} />
                        <WidgetWarning warning={widgetEffects?.warnings} />
                        {!hideWidgets.indicator && (
                            <WidgetIndicator
                                indicators={widgetEffects?.indicators}
                                emptyText={i18n.t('No indicator output for this enrollment yet')}
                            />
                        )}
                        {!hideWidgets.feedback && (
                            <WidgetFeedback
                                feedback={widgetEffects?.feedbacks}
                                emptyText={i18n.t('No feedback for this enrollment yet')}
                            />
                        )}
                        <WidgetProfile
                            teiId={teiId}
                            programId={program.id}
                            orgUnitId={orgUnitId}
                            onUpdateTeiAttributeValues={onUpdateTeiAttributeValues}
                            showEdit
                        />
                        {enrollmentId !== 'AUTO' && <WidgetEnrollment
                            teiId={teiId}
                            enrollmentId={enrollmentId}
                            programId={program.id}
                            onDelete={onDelete}
                            onAddNew={onAddNew}
                            onError={onEnrollmentError}
                        />}
                    </div>
                </div>
            </div>
        </>
    );
};


export const EnrollmentPageDefaultComponent: ComponentType<Props> = withStyles(
    getStyles,
)(EnrollmentPageDefaultPlain);
