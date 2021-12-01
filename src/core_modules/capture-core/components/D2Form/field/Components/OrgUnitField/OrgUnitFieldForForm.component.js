// @flow
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';
import {
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
} from '../../../../FormFields/New';
import { withFormFieldOrgUnitsHandler } from './withFormFieldOrgUnitsHandler';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const OrgUnitFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withCalculateMessages()(
                        withDefaultFieldContainer()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: Object) =>
                                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.orgUnitLabel}`,
                            })(
                                withFilterProps(getFilteredProps)(
                                    withDisplayMessages()(
                                        withInternalChangeHandler()(
                                            withFormFieldOrgUnitsHandler()(
                                                SingleOrgUnitSelectField,
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
