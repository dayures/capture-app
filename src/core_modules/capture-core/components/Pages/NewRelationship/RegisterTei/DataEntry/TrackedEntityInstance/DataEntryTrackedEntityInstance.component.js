// @flow
import React from 'react';
import { withTheme } from '@material-ui/core';
import type { RenderFoundation, TeiRegistration } from '../../../../../../metaData';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import { TeiRegistrationEntry } from '../../../../../DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.component';
import { useSaveButtonText } from '../useSaveButtonText';

type Props = {|
    theme: Theme,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    onGetUnsavedAttributeValues: Function,
    onPostProcessErrorMessage: Function,
    teiRegistrationMetadata: ?TeiRegistration,
|};

const RelationshipTrackedEntityInstance =
  ({
      theme,
      onSave,
      onGetUnsavedAttributeValues,
      onPostProcessErrorMessage,
      teiRegistrationMetadata = {},
  }: Props) => {
      const { trackedEntityType } = teiRegistrationMetadata || {};
      const saveButtonText = useSaveButtonText(trackedEntityType.name);

      const fieldOptions = { theme, fieldLabelMediaBasedClass: teiClasses.fieldLabelMediaBased };
      return (
          <TeiRegistrationEntry
              id={DATA_ENTRY_ID}
              teiRegistrationMetadata={teiRegistrationMetadata}
              selectedScopeId={teiRegistrationMetadata && teiRegistrationMetadata.form.id}
              saveButtonText={saveButtonText}
              fieldOptions={fieldOptions}
              onSave={onSave}
              onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
              onPostProcessErrorMessage={onPostProcessErrorMessage}
          />
      );
  };

export default withTheme()(RelationshipTrackedEntityInstance);
