// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';

const converter = (() => {
    const getTrackedEntityTypeAttribute = (trackedEntityTypeAttribute) => {
        const { trackedEntityAttribute, ...restAttribute } = trackedEntityTypeAttribute;
        const trackedEntityAttributeId = trackedEntityAttribute && trackedEntityAttribute.id;

        return {
            ...restAttribute,
            trackedEntityAttributeId,
        };
    };

    const getTrackedEntityTypeAttributes = trackedEntityTypeAttributes =>
        (trackedEntityTypeAttributes || [])
            .map(trackedEntityTypeAttribute => getTrackedEntityTypeAttribute(trackedEntityTypeAttribute));

    return response =>
        ((response && response.trackedEntityTypes) || [])
            .map(trackedEntityType => ({
                ...trackedEntityType,
                trackedEntityTypeAttributes:
                    getTrackedEntityTypeAttributes(trackedEntityType.trackedEntityTypeAttributes),
            }));
})();

export const storeTrackedEntityTypes = (() => {
    const getFields = () => 'id,displayName,minAttributesRequiredToSearch,featureType,' +
    'trackedEntityTypeAttributes[trackedEntityAttribute[id],displayInList,mandatory,searchable],' +
    'translations[property,locale,value]';

    return () => {
        const query = {
            resource: 'trackedEntityTypes',
            params: {
                fields: getFields(),
            },
        };

        return quickStore(query, getContext().storeNames.TRACKED_ENTITY_TYPES, { onConvert: converter });
    };
})();
