// @flow

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { MetadataByPluginId } from '../DataEntryPlugin.types';

export const usePluginMessages = (formId: string, metadataByPluginId: MetadataByPluginId) => {
    const rulesEffects = useSelector(({ rulesEffectsMessages }) => rulesEffectsMessages[formId]);
    const formFieldsUI = useSelector(({ formsSectionsFieldsUI }) => formsSectionsFieldsUI[formId]);

    const { errors, warnings } = useMemo(() => {
        if (!metadataByPluginId) {
            return {
                errors: {},
                warnings: {},
            };
        }

        return Object.entries(metadataByPluginId)
            .reduce((acc, metadata) => {
                const [idFromPlugin, dataElement] = metadata;
                // $FlowFixMe - Not sure why flow thinks this is mixed type
                const fieldId = dataElement.id;

                if (rulesEffects) {
                    const { error: fieldErrors, warning: fieldWarnings } = rulesEffects[fieldId] ?? {};
                    if (fieldErrors) {
                        acc.errors[idFromPlugin] = [...fieldErrors];
                    }
                    if (fieldWarnings) {
                        acc.warnings[idFromPlugin] = [...fieldWarnings];
                    }
                }

                if (formFieldsUI) {
                    const { errorMessage: fieldUIError } = formFieldsUI[fieldId] ?? {};

                    if (fieldUIError) {
                        acc.errors[idFromPlugin] = [...(acc.errors[idFromPlugin] ?? []), fieldUIError];
                    }
                }

                return acc;
            }, { errors: {}, warnings: {} });
    }, [formFieldsUI, metadataByPluginId, rulesEffects]);

    return {
        errors,
        warnings,
    };
};
