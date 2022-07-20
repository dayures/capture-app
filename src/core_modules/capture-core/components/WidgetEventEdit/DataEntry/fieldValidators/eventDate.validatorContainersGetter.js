// @flow
import { hasValue, isValidNonFutureDate } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import { isValidDate } from '../../../../utils/validators/form';

const preValidateDate = (value?: ?string) => {
    if (!value) {
        return true;
    }

    return isValidDate(value);
};

export const getEventDateValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: hasValue,
            message: i18n.t('A value is required'),
        },
        {
            validator: preValidateDate,
            message: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};

export const getNoFutureEventDateValidatorContainers = () => {
    const validatorContainers = getEventDateValidatorContainers();
    validatorContainers.push({
        validator: isValidNonFutureDate,
        message: i18n.t('A future date is not allowed'),
    });
    return validatorContainers;
};
