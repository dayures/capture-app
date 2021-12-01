// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { IndicatorProps } from '../WidgetFeedback/WidgetFeedback.types';
import { Widget } from '../Widget';
import { WidgetIndicatorContent } from './WidgetIndicatorContent/WidgetIndicatorContent';

export const WidgetIndicator = ({ indicators, emptyText }: IndicatorProps) => {
    const [openStatus, setOpenStatus] = useState(true);
    return (
        <div
            data-test="indicator-widget"
        >
            <Widget
                header={i18n.t('Indicators')}
                open={openStatus}
                onClose={() => setOpenStatus(false)}
                onOpen={() => setOpenStatus(true)}
            >
                <WidgetIndicatorContent
                    widgetData={indicators}
                    emptyText={emptyText}
                />
            </Widget>
        </div>
    );
};
