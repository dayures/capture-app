// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { type OrgUnit } from '@dhis2/rules-engine-javascript';
import {
    DataEntry,
    placements,
    withDataEntryField,
    withDataEntryFieldIfApplicable,
    withBrowserBackWarning,
    inMemoryFileStore,
} from '../../DataEntry';
import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    DateField,
    CoordinateField,
    PolygonField,
    withCalculateMessages,
    withDisplayMessages,
    withFilterProps,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    orientations,
    CategoryOptions,
} from '../../FormFields/New';
import type { ProgramCategory } from '../../FormFields/New/CategoryOptions/CategoryOptions.types';
import labelTypeClasses from './fieldLabels.module.css';
import {
    getEnrollmentDateValidatorContainer,
    getIncidentDateValidatorContainer,
    getCategoryOptionsValidatorContainers,
} from './fieldValidators';
import { sectionKeysForEnrollmentDataEntry } from './constants/sectionKeys.const';
import { type Enrollment } from '../../../metaData';

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};
const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
};

function defaultFilterProps(props: Object) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getBaseComponentProps = (props: Object) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

const getEnrollmentDateSettings = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(DateField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const enrollmentDateSettings = {
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.enrollmentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarMaxMoment: !props.enrollmentMetadata.allowFutureEnrollmentDate ? moment() : undefined,
        }),
        getPropName: () => 'enrolledAt',
        getValidatorContainers: (props: Object) =>
            getEnrollmentDateValidatorContainer(props.enrollmentMetadata.allowFutureEnrollmentDate),
        getMeta: () => ({
            placement: placements.TOP,
            section: sectionKeysForEnrollmentDataEntry.ENROLLMENT,
        }),
    };

    return enrollmentDateSettings;
};

const getCategoryOptionsSettingsFn = () => {
    const categoryOptionsComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(CategoryOptions),
                        ),
                    ),
                ),
            ),
        );
    const categoryOptionsSettings = {
        isApplicable: (props: Object) => !!props.programCategory?.categories && !props.programCategory.isDefault,
        getComponent: () => categoryOptionsComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            orientation: getOrientation(props.formHorizontal),
            categories: props.programCategory.categories,
            selectedCategories: props.selectedCategories,
            selectedOrgUnitId: props.orgUnitId,
            onClickCategoryOption: props.onClickCategoryOption,
            onResetCategoryOption: props.onResetCategoryOption,
            required: true,
        }),
        getPropName: () => 'attributeCategoryOptions',
        getValidatorContainers: () => getCategoryOptionsValidatorContainers(),
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: sectionKeysForEnrollmentDataEntry.CATEGORYCOMBO,
        }),
    };

    return categoryOptionsSettings;
};

const getIncidentDateSettings = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(DateField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const incidentDateSettings = {
        isApplicable: (props: Object) => {
            const showIncidentDate = props.enrollmentMetadata.showIncidentDate;
            return showIncidentDate;
        },
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.incidentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarMaxMoment: !props.enrollmentMetadata.allowFutureIncidentDate ? moment() : undefined,
        }),
        getPropName: () => 'occurredAt',
        getValidatorContainers: (props: Object) =>
            getIncidentDateValidatorContainer(props.enrollmentMetadata.allowFutureIncidentDate),
        getMeta: () => ({
            placement: placements.TOP,
            section: sectionKeysForEnrollmentDataEntry.ENROLLMENT,
        }),
    };

    return incidentDateSettings;
};

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(CoordinateField),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

const polygonComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(PolygonField),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

const getOrientation = (formHorizontal: ?boolean) => (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);

const getGeometrySettings = () => ({
    isApplicable: (props: Object) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: Object) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }

        return pointComponent;
    },
    getComponentProps: (props: Object) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
        });
    },
    getPropName: () => 'geometry',
    getValidatorContainers: () => [],
    getMeta: () => ({
        placement: placements.TOP,
        section: sectionKeysForEnrollmentDataEntry.ENROLLMENT,
    }),
});

type FinalTeiDataEntryProps = {
    enrollmentMetadata: Enrollment,
    programId: string,
    programCategory?: ProgramCategory,
};
// final step before the generic dataEntry is inserted

const dataEntrySectionDefinitions = {
    [sectionKeysForEnrollmentDataEntry.ENROLLMENT]: {
        placement: placements.TOP,
        name: i18n.t('Enrollment'),
    },
    [sectionKeysForEnrollmentDataEntry.CATEGORYCOMBO]: {
        placement: placements.TOP,
        name: 'Data entry',
    },
};

type State = {
    dataEntrySections: { [string]: {name: string, placement: $Values<typeof placements>}},
}
class FinalEnrollmentDataEntry extends React.Component<FinalTeiDataEntryProps, State> {
    constructor(props) {
        super(props);

        const dataEntrySections = props.programCategory ? {
            ...dataEntrySectionDefinitions,
            [sectionKeysForEnrollmentDataEntry.CATEGORYCOMBO]: {
                ...dataEntrySectionDefinitions[sectionKeysForEnrollmentDataEntry.CATEGORYCOMBO],
                name: props.programCategory.displayName,
            },
        } : dataEntrySectionDefinitions;

        this.state = {
            dataEntrySections,
        };
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }


    render() {
        const { enrollmentMetadata, programId, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DataEntry
                {...passOnProps}
                dataEntrySections={this.state.dataEntrySections}
                formFoundation={enrollmentMetadata.enrollmentForm}
            />
        );
    }
}

const LocationHOC = withDataEntryFieldIfApplicable(getGeometrySettings())(FinalEnrollmentDataEntry);
const IncidentDateFieldHOC = withDataEntryFieldIfApplicable(getIncidentDateSettings())(LocationHOC);
const EnrollmentDateFieldHOC = withDataEntryField(getEnrollmentDateSettings())(IncidentDateFieldHOC);
const CategoryComboFieldsHOC = withDataEntryFieldIfApplicable(getCategoryOptionsSettingsFn())(EnrollmentDateFieldHOC);
const BrowserBackWarningHOC = withBrowserBackWarning()(CategoryComboFieldsHOC);

type PreEnrollmentDataEntryProps = {
    programId: string,
    orgUnit: OrgUnit,
    onUpdateField: Function,
    onUpdateDataEntryField: Function,
    onStartAsyncUpdateField: Function,
    onGetUnsavedAttributeValues?: ?Function,
    teiId?: ?string,
};

class PreEnrollmentDataEntryPure extends React.PureComponent<Object> {
    render() {
        return (
            <BrowserBackWarningHOC
                {...this.props}
            />
        );
    }
}

export class EnrollmentDataEntryComponent extends React.Component<PreEnrollmentDataEntryProps> {
    getValidationContext = () => {
        const { orgUnit, onGetUnsavedAttributeValues, programId, teiId } = this.props;
        return {
            programId,
            orgUnitId: orgUnit.id,
            trackedEntityInstanceId: teiId,
            onGetUnsavedAttributeValues,
        };
    }

    handleUpdateField = (...args: Array<any>) => {
        const { programId, orgUnit } = this.props;
        this.props.onUpdateField(...args, programId, orgUnit);
    }

    handleUpdateDataEntryField = (...args: Array<any>) => {
        const { programId, orgUnit } = this.props;
        this.props.onUpdateDataEntryField(...args, programId, orgUnit);
    }

    handleStartAsyncUpdateField = (...args: Array<any>) => {
        const { programId, orgUnit } = this.props;
        this.props.onStartAsyncUpdateField(...args, programId, orgUnit);
    }

    render() {
        const {
            orgUnit,
            programId,
            onUpdateField,
            onUpdateDataEntryField,
            onStartAsyncUpdateField,
            onGetUnsavedAttributeValues,
            ...passOnProps
        } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <PreEnrollmentDataEntryPure
                onGetValidationContext={this.getValidationContext}
                onUpdateFormField={this.handleUpdateField}
                onUpdateDataEntryField={this.handleUpdateDataEntryField}
                onUpdateFormFieldAsync={this.handleStartAsyncUpdateField}
                {...passOnProps}
            />
        );
    }
}
