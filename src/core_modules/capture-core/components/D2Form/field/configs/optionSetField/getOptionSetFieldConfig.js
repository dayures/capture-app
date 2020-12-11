// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { OptionSetSelectFieldForForm, OptionSetBoxesFieldForForm } from '../../Components';
import { getOptionsForRadioButtons, getOptionsForSelect } from './optionSetHelpers';
import { orientations } from '../../../../FormFields/New';
import { inputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import type { DataElement } from '../../../../../metaData';

const mapInputTypeToPropsGetterFn = {
  [inputTypes.DROPDOWN]: (metaData: DataElement) => ({
    // $FlowFixMe[incompatible-call] automated comment
    options: getOptionsForSelect(metaData.optionSet),
    nullable: !metaData.compulsory,
    style: {
      width: '100%',
    },
  }),
  [inputTypes.HORIZONTAL_RADIOBUTTONS]: (metaData: DataElement) => ({
    // $FlowFixMe[incompatible-call] automated comment
    options: getOptionsForRadioButtons(metaData.optionSet),
  }),
  [inputTypes.VERTICAL_RADIOBUTTONS]: (metaData: DataElement) => ({
    orientation: orientations.VERTICAL,

    // $FlowFixMe[incompatible-call] automated comment
    options: getOptionsForRadioButtons(metaData.optionSet),
  }),
};

const mapInputTypeToComponent = {
  [inputTypes.DROPDOWN]: OptionSetSelectFieldForForm,
  [inputTypes.HORIZONTAL_RADIOBUTTONS]: OptionSetBoxesFieldForForm,
  [inputTypes.VERTICAL_RADIOBUTTONS]: OptionSetBoxesFieldForForm,
};

const getOptionSetFieldConfig = (metaData: DataElement, options: Object) => {
  const { optionSet } = metaData;
  // $FlowFixMe[incompatible-use] automated comment
  const { inputType } = optionSet;
  const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

  const props = createProps(
    {
      id: metaData.id,
      formId: options.formId,
      formHorizontal: options.formHorizontal,
      fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
      // $FlowFixMe[incompatible-use] automated comment
      optionGroups: optionSet.optionGroups,
      ...inputTypeProps,
    },
    options,
    metaData,
  );

  return createFieldConfig(
    {
      component: mapInputTypeToComponent[inputType],
      props,
      commitEvent: inputType === inputTypes.DROPDOWN ? 'onBlur' : 'onSelect',
    },
    metaData,
  );
};

export default getOptionSetFieldConfig;
