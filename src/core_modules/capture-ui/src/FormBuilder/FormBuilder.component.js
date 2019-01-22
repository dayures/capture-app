// @flow
/* eslint-disable complexity */
import * as React from 'react';
import isDefined from 'd2-utilizr/lib/isDefined';
import isObject from 'd2-utilizr/lib/isObject';
import defaultClasses from './formBuilder.mod.css';


export type ValidatorContainer = {
    validator: (value: any, validationContext: ?Object) => boolean,
    message: string,
    validatingMessage?: ?string,
    type?: ?string,
    async?: ?boolean,
};

export type FieldConfig = {
    id: string,
    component: React.ComponentType<any>,
    props?: ?Object,
    validators?: ?Array<ValidatorContainer>,
    commitEvent?: ?string,
    onIsEqual?: ?(newValue: any, oldValue: any) => boolean,
};

type FieldUI = {
    touched?: ?boolean,
    valid?: ?boolean,
    errorMessage?: ?string,
    errorType?: ?string,
    validatingMessage?: ?string,
};

type RenderDividerFn = (index: number, fieldsCount: number, field: FieldConfig) => React.Node;
type GetContainerPropsFn = (index: number, fieldsCount: number, field: FieldConfig) => Object;

type RenderFieldFn = (
    field: FieldConfig,
    index: number,
    onRenderDivider?: ?RenderDividerFn,
    onGetContainerProps?: ?GetContainerPropsFn
) => React.Node

type IsValidatingInnerFn = (
    fieldId: string,
    formBuilderId: string,
    validatingPromise: Promise<any>,
    onIsValidating: ?Function,
    message: ?string,
    fieldUIUpdates: ?FieldUI,
) => void;

type Props = {
    id: string,
    fields: Array<FieldConfig>,
    values: { [id: string]: any },
    fieldsUI: { [id: string]: FieldUI },
    onUpdateFieldAsync: (fieldId: string, fieldLabel: string, formBuilderId: string, callback: Function) => void,
    onUpdateField: (value: any, uiState: FieldUI, fieldId: string, formBuilderId: string, promiseForIsValidating: Promise<any>) => void,
    onUpdateFieldUIOnly: (uiState: FieldUI, fieldId: string, formBuilderId: string) => void,
    onFieldsValidated: ?Function,
    onFieldsValidatedInner: (fieldsUI: { [id: string]: FieldUI }, formBuilderId: string, promisesForIsValidating: Array<Promise<any>>, onFieldsValidated: ?Function) => void,
    validationAttempted?: ?boolean,
    validateIfNoUIData?: ?boolean,
    formHorizontal: ?boolean,
    children?: ?(RenderFieldFn, fields: Array<FieldConfig>) => React.Node,
    onRenderDivider?: ?RenderDividerFn,
    onGetContainerProps?: ?GetContainerPropsFn,
    onGetValidationContext: ?() => ?Object,
    onIsValidating: ?Function,
    onIsValidatingInner: IsValidatingInnerFn,
    onValidatingPromiseComplete: (validatingPromise: Promise<any>) => void,
};

type FieldCommitOptions = {
    touched?: boolean,
};

type FieldsValidatingPromiseContainer = { [fieldId: string]: ?{ promise: Promise<any>, resolver: Function } };

class FormBuilder extends React.Component<Props> {
    static async validateField(
        field: FieldConfig,
        value: any,
        validationContext: ?Object,
        onIsValidatingInternal: ?Function,
    ): Promise<{ valid: boolean, errorMessage?: ?string, errorType?: ?string }> {
        if (!field.validators || field.validators.length === 0) {
            return {
                valid: true,
            };
        }

        let isValidating = false;
        const triggerValidatingInProgress = (message: ?string) => {
            if (!isValidating) {
                onIsValidatingInternal && onIsValidatingInternal(message);
                isValidating = true;
            }
        };

        const validatorResult = await field.validators
            .reduce(async (passPromise, currentValidator) => {
                const pass = await passPromise;
                if (pass === true) {
                    let result = currentValidator.validator(value, validationContext);
                    if (result instanceof Promise) {
                        triggerValidatingInProgress(currentValidator.validatingMessage);
                        result = await result;
                    }

                    if (result === true || (result && result.valid)) {
                        return true;
                    }

                    return {
                        message: (result && result.errorMessage) || currentValidator.message,
                        type: currentValidator.type,
                    };
                }
                return pass;
            }, Promise.resolve(true));

        if (validatorResult !== true) {
            return {
                valid: false,
                errorMessage: validatorResult.message,
                errorType: validatorResult.type,
            };
        }

        return {
            valid: true,
        };
    }

    static getAsyncUIState(fieldsUI: { [id: string]: FieldUI }) {
        return Object.keys(fieldsUI).reduce((accAsyncUIState, fieldId) => {
            const fieldUI = fieldsUI[fieldId];
            accAsyncUIState[fieldId] = FormBuilder.getFieldAsyncUIState(fieldUI);
            return accAsyncUIState;
        }, {});
    }

    static getFieldAsyncUIState(fieldUI: FieldUI) {
        const ignoreKeys = ['valid', 'errorMessage', 'touched'];
        return Object.keys(fieldUI).reduce((accFieldAsyncUIState, propId) => {
            if (!ignoreKeys.includes(propId)) {
                accFieldAsyncUIState[propId] = fieldUI[propId];
            }
            return accFieldAsyncUIState;
        }, {});
    }

    static updateAsyncUIState(
        oldFieldsUI: { [id: string]: FieldUI },
        newFieldsUI: { [id: string]: FieldUI },
        asyncUIState: { [id: string]: Object }) {
        return Object.keys(newFieldsUI).reduce((accAsyncUIState, fieldId) => {
            const newFieldUI = newFieldsUI[fieldId];
            const oldFieldUI = oldFieldsUI[fieldId];

            if (newFieldUI !== oldFieldUI) {
                accAsyncUIState[fieldId] = FormBuilder.getFieldAsyncUIState(newFieldUI);
            }
            return accAsyncUIState;
        }, asyncUIState);
    }

    static executeValidateAllFields(
        props: Props,
        fieldsValdatingPromiseContainer: FieldsValidatingPromiseContainer,
    ) {
        const {
            id,
            fields,
            values,
            onGetValidationContext,
            onIsValidatingInner,
            onIsValidating,
            onValidatingPromiseComplete,
        } = props;
        const validationCompletePromiseContainers = [];
        const validationContext = onGetValidationContext && onGetValidationContext();
        const validationPromises = fields
            .map(async (field) => {
                let fieldValidatingCompletePromiseResolver;
                const fieldValidatingCompletePromise: Promise<any> = new Promise((resolve: Function) => {
                    fieldValidatingCompletePromiseResolver = resolve;
                });

                // resolve previous field validating promise if there is any
                const previousFieldValidatingPromiseContainer = fieldsValdatingPromiseContainer[field.id];
                if (previousFieldValidatingPromiseContainer) {
                    previousFieldValidatingPromiseContainer.resolver();
                    onValidatingPromiseComplete(previousFieldValidatingPromiseContainer.promise);
                }

                // set active promise and resolver
                fieldsValdatingPromiseContainer[field.id] = {
                    promise: fieldValidatingCompletePromise,
                    // $FlowFixMe
                    resolver: fieldValidatingCompletePromiseResolver,
                };

                const handleIsValidatingInternal = (message: ?string) => {
                    if (fieldValidatingCompletePromise === (
                        fieldsValdatingPromiseContainer[field.id] &&
                        fieldsValdatingPromiseContainer[field.id].promise)) {
                        validationCompletePromiseContainers.push({
                            promise: fieldValidatingCompletePromise,
                            resolve: fieldValidatingCompletePromiseResolver,
                        });

                        onIsValidatingInner(
                            field.id,
                            id,
                            fieldValidatingCompletePromise,
                            onIsValidating,
                            message,
                        );
                    }
                };

                const validationData = await FormBuilder.validateField(
                    field,
                    values[field.id],
                    validationContext,
                    handleIsValidatingInternal,
                );
                return {
                    id: field.id,
                    validationData,
                };
            });

        return Promise
            .all(validationPromises)
            .then(validationContainers => validationContainers
                .reduce((accFieldsUI, container) => {
                    accFieldsUI[container.id] = container.validationData;
                    return accFieldsUI;
                }, {}),
            )
            .then(validationData => ({
                validationData,
                validationCompletePromiseContainers,
            }));
    }

    static validateAllFields(
        props: Props,
        fieldsValdatingPromiseContainer: FieldsValidatingPromiseContainer,
    ) {
        FormBuilder.executeValidateAllFields(props, fieldsValdatingPromiseContainer)
            .then((validationResult) => {
                const { validationData, validationCompletePromiseContainers } = validationResult;
                props.onFieldsValidatedInner(
                    validationData,
                    props.id,
                    validationCompletePromiseContainers
                        .map(container => container.promise),
                    props.onFieldsValidated,
                );
                validationCompletePromiseContainers
                    .map(container => container.resolve)
                    .forEach((resolve) => {
                        resolve();
                    });
            });
    }

    fieldInstances: Map<string, any>;
    asyncUIState: { [id: string]: FieldUI };
    fieldsValdatingPromiseContainer: FieldsValidatingPromiseContainer;

    constructor(props: Props) {
        super(props);
        this.fieldInstances = new Map();
        this.asyncUIState = FormBuilder.getAsyncUIState(this.props.fieldsUI);
        this.fieldsValdatingPromiseContainer = {};

        if (this.props.validateIfNoUIData) {
            FormBuilder.validateAllFields(this.props, this.fieldsValdatingPromiseContainer);
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.id !== this.props.id) {
            this.asyncUIState = FormBuilder.getAsyncUIState(this.props.fieldsUI);
        } else {
            this.asyncUIState =
                FormBuilder.updateAsyncUIState(this.props.fieldsUI, newProps.fieldsUI, this.asyncUIState);
        }

        if (this.props.validateIfNoUIData &&
            (newProps.id !== this.props.id || newProps.fields.length !== Object.keys(newProps.fieldsUI).length)
        ) {
            FormBuilder.validateAllFields(newProps, this.fieldsValdatingPromiseContainer);
        }
    }

    /**
     * Retreive the field that has the specified field id
     *
     * @param fieldId
     * @returns {}
    */
    getFieldProp(fieldId: string): FieldConfig {
        // $FlowSuppress
        return this.props.fields.find(f => f.id === fieldId);
    }

    hasCommitedValueChanged(field: FieldConfig, value: any) {
        let valueChanged = true;
        const oldValue = this.props.values[field.id];

        if (!isObject(value)) {
            if ((value || '') === (oldValue || '')) {
                valueChanged = false;
            }
        } else if (field.onIsEqual && field.onIsEqual(value, oldValue)) {
            valueChanged = false;
        }

        return valueChanged;
    }

    async commitFieldUpdate(fieldId: string, value: any, options?: ?FieldCommitOptions) {
        const {
            onUpdateFieldUIOnly,
            onUpdateField,
            onGetValidationContext,
            id,
            onIsValidatingInner,
            onIsValidating,
            onValidatingPromiseComplete,
        } = this.props;
        const field = this.getFieldProp(fieldId);
        const touched = options && isDefined(options.touched) ? options.touched : true;

        if (!this.hasCommitedValueChanged(field, value)) {
            onUpdateFieldUIOnly({ touched }, fieldId, id);
            return;
        }

        let resolveUpdateCompletePromise;
        const updateCompletePromise = new Promise((resolve) => {
            resolveUpdateCompletePromise = resolve;
        });

        // resolve previous field validating promise if there is any
        const previousFieldValidatingPromiseContainer = this.fieldsValdatingPromiseContainer[fieldId];
        if (previousFieldValidatingPromiseContainer) {
            previousFieldValidatingPromiseContainer.resolver();
            onValidatingPromiseComplete(previousFieldValidatingPromiseContainer.promise);
        }

        // set active promise and resolver
        this.fieldsValdatingPromiseContainer[fieldId] = {
            promise: updateCompletePromise,
            // $FlowFixMe
            resolver: resolveUpdateCompletePromise,
        };

        const handleIsValidatingInternal = (message: ?string) => {
            // is this still the last commit field update request
            if (updateCompletePromise === (
                this.fieldsValdatingPromiseContainer[fieldId] &&
                this.fieldsValdatingPromiseContainer[fieldId].promise)) {
                onIsValidatingInner(
                    fieldId,
                    id,
                    updateCompletePromise,
                    onIsValidating,
                    message,
                    {
                        touched: true,
                    },
                );
            }
        };

        const updatePromise = FormBuilder.validateField(
            field,
            value,
            onGetValidationContext && onGetValidationContext(),
            handleIsValidatingInternal,
        )
            .then(({ valid, errorMessage, errorType }) => {
                // is this still the last commit field update request
                if (updateCompletePromise === (
                    this.fieldsValdatingPromiseContainer[fieldId] &&
                    this.fieldsValdatingPromiseContainer[fieldId].promise)) {
                    onUpdateField(
                        value,
                        {
                            valid,
                            touched,
                            errorMessage,
                            errorType,
                        },
                        fieldId,
                        id,
                        updateCompletePromise,
                    );
                    resolveUpdateCompletePromise();
                    this.fieldsValdatingPromiseContainer[fieldId] = null;
                }
            });
        await updatePromise;
    }

    handleUpdateAsyncState = (fieldId: string, asyncStateToAdd: Object) => {
        this.props.onUpdateFieldUIOnly(asyncStateToAdd, fieldId, this.props.id);
    }

    handleCommitAsync = (fieldId: string, fieldLabel: string, callback: Function) => {
        this.props.onUpdateFieldAsync(fieldId, fieldLabel, this.props.id, callback);
    }

    /**
     *  Retain a reference to the form field instance
    */
    setFieldInstance(instance: any, id: string) {
        if (!instance) {
            if (this.fieldInstances.has(id)) {
                this.fieldInstances.delete(id);
            }
        } else {
            this.fieldInstances.set(id, instance);
        }
    }

    isValid(typesToCheck?: ?Array<string>) {
        return Object
            .keys(this.props.fieldsUI)
            .every((key) => {
                const fieldUI = this.props.fieldsUI[key];
                if (typesToCheck) {
                    const isCheckable = typesToCheck.includes(fieldUI.errorType);
                    if (!isCheckable) {
                        return true;
                    }
                }
                return fieldUI.valid;
            });
    }

    getInvalidFields(externalInvalidFields?: ?{ [id: string]: boolean }) {
        const propFields = this.props.fields;
        return propFields.reduce((invalidFieldsContainer, field) => {
            const fieldUI = this.props.fieldsUI[field.id];
            if (!fieldUI.valid) {
                invalidFieldsContainer.push({
                    prop: field,
                    instance: this.fieldInstances.get(field.id),
                    uiState: fieldUI,
                });
            } else if (externalInvalidFields && externalInvalidFields[field.id]) {
                invalidFieldsContainer.push({
                    prop: field,
                    instance: this.fieldInstances.get(field.id),
                    uiState: fieldUI,
                });
            }
            return invalidFieldsContainer;
        }, []);
    }

    renderField = (
        field: FieldConfig,
        index: number,
        onRenderDivider?: ?RenderDividerFn,
        onGetContainerProps?: ?GetContainerPropsFn,
    ) => {
        const {
            fields,
            values,
            fieldsUI,
            validationAttempted,
            id,
            onFieldsValidated,
            onFieldsValidatedInner,
            onUpdateField,
            onUpdateFieldAsync,
            onUpdateFieldUIOnly,
            validateIfNoUIData,
            children,
            onRenderDivider: extractOnRenderDivider,
            onGetContainerProps: extractOnGetContainerProps,
            onIsValidating,
            onIsValidatingInner,
            onGetValidationContext,
            ...passOnProps } = this.props;

        const props = field.props || {};
        const fieldUI = fieldsUI[field.id] || {};
        const value = values[field.id];

        const commitFieldHandler = this.commitFieldUpdate.bind(this, field.id);
        const commitEvent = field.commitEvent || 'onBlur';
        const commitPropObject = {
            [commitEvent]: commitFieldHandler,
        };

        const asyncProps = {};

        if (props.async) {
            asyncProps.onCommitAsync = (callback: Function) => this.handleCommitAsync(field.id, props.label, callback);
            asyncProps.onUpdateAsyncUIState = (asyncState: Object) => this.handleUpdateAsyncState(field.id, asyncState);
            asyncProps.asyncUIState = this.asyncUIState[field.id];
        }

        return (
            <div
                key={field.id}
                className={defaultClasses.fieldOuterContainer}
            >
                <div
                    {...onGetContainerProps && onGetContainerProps(index, fields.length, field)}
                >
                    <field.component
                        ref={(fieldInstance) => { this.setFieldInstance(fieldInstance, field.id); }}
                        value={value}
                        errorMessage={fieldUI.errorMessage}
                        touched={fieldUI.touched}
                        validationAttempted={validationAttempted}
                        validatingMessage={fieldUI.validatingMessage}
                        {...commitPropObject}
                        {...props}
                        {...passOnProps}
                        {...asyncProps}
                    />
                </div>

                {onRenderDivider && onRenderDivider(index, fields.length, field)}
            </div>
        );
    }

    renderFields() {
        const { fields, children, onRenderDivider, onGetContainerProps } = this.props;

        if (children) {
            return children(this.renderField, fields);
        }
        // $FlowFixMe
        return fields.map(
            (field, index) =>
                this.renderField(field, index, onRenderDivider, onGetContainerProps),
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderFields()}
            </React.Fragment>
        );
    }
}

export default FormBuilder;
