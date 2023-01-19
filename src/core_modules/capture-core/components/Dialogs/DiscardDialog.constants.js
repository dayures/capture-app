// @flow
import i18n from '@dhis2/d2-i18n';

export const defaultDialogProps = {
    header: i18n.t('Discard unsaved changes?'),
    text: i18n.t('This event has unsaved changes. Leaving this page without saving will lose these changes. Are you sure you want to discard unsaved changes?'),
    destructiveText: i18n.t('Yes, discard changes'),
    cancelText: i18n.t('No, stay here'),
};

export const savingInProgressDialogProps = {
    header: i18n.t('Saving in progress'),
    text: i18n.t('If you switch the context, you will not be redirected to the newly registered $TETypeName after registration completes.'),
    cancelText: i18n.t('No, do not switch context'),
    confirmText: i18n.t('Yes, switch context'),
};
