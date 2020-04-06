// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

export const storeRelationshipTypes = () => {
    const query = {
        resource: 'relationshipTypes',
        params: {
            fields: 'id,displayName,fromConstraint[*],toConstraint[*],access[*]',
        },
    };

    const converter = response => response.relationshipTypes;

    return quickStoreRecursively(query, getContext().storeNames.RELATIONSHIP_TYPES, { onConvert: converter });
};
