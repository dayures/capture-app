// @flow
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';
import {
    TextField,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
    withFilterProps,
} from '../../../../FormFields/New';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const TextFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withFocusSaver()(
                        withCalculateMessages()(
                            withDefaultFieldContainer()(
                                withLabel({
                                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                    onGetCustomFieldLabeClass: (props: Object) =>
                                        `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                                })(
                                    withFilterProps(getFilteredProps)(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(TextField),
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
