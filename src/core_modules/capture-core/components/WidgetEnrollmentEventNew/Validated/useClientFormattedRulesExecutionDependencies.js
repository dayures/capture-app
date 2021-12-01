// @flow
import { useMemo } from 'react';
import type {
    RulesExecutionDependencies,
    AttributeValuesClientFormatted,
} from '../common.types';
import { dataElementTypes, type TrackerProgram } from '../../../metaData';
import { prepareEnrollmentEventsForRulesEngine } from '../../../events/getEnrollmentEvents';
import { convertServerToClient } from '../../../converters';

const prepareAttributesForRulesEngine =
    (attributeValues, program: TrackerProgram): AttributeValuesClientFormatted => attributeValues
        .reduce((accAttributeValues, { id, value }) => {
            const { type } = program.attributes.find(({ id: metadataId }) => id === metadataId) || {};
            accAttributeValues[id] = convertServerToClient(value, type);
            return accAttributeValues;
        }, {});

const prepareEnrollmentDataForRulesEngine = ({ enrollmentDate, incidentDate, enrollmentId }) => ({
    enrollmentDate: convertServerToClient(enrollmentDate, dataElementTypes.DATE),
    incidentDate: convertServerToClient(incidentDate, dataElementTypes.DATE),
    enrollmentId,
});

export const useClientFormattedRulesExecutionDependencies =
    ({ events, attributeValues, enrollmentData }: RulesExecutionDependencies, program: TrackerProgram) =>
        useMemo(() => ({
            events: prepareEnrollmentEventsForRulesEngine(events),
            attributeValues: prepareAttributesForRulesEngine(attributeValues, program),
            enrollmentData: prepareEnrollmentDataForRulesEngine(enrollmentData),
        }), [events, attributeValues, enrollmentData, program]);

