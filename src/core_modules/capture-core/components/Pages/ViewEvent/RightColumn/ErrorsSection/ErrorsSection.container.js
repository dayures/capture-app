// @flow
import { connect } from 'react-redux';
import { makeGetVisibleMessages } from './messageSection.selectors';
import { ErrorsSectionComponent } from './ErrorsSection.component';

const makeStateToProps = () => {
    const getVisibleErrors = makeGetVisibleMessages();
    const mapStateToProps = (state: ReduxState, props: Object) => {
        const messagesContainer = state.rulesEffectsGeneralErrors[props.dataEntryKey];
        return {
            errors: getVisibleErrors({
                messagesContainer,
                containerPropNameMain: 'error',
                containerPropNameOnComplete: 'errorOnComplete',
                showOnComplete: true,
            }),
        };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};
// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ErrorsSection = connect(makeStateToProps, () => ({}))(ErrorsSectionComponent);
