// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultClasses from './table.module.css';

type Props = {
    children: React.Node,
    className?: ?string,
};

export const Row = (props: Props, context: { table?: ?{ head: boolean, footer: boolean }}) => {
    const { children, className, ...passOnProps } = props;

    const { table } = context;
    const classes = classNames(
        defaultClasses.tableRow,
        {
            [defaultClasses.tableRowBody]: !table,
            [defaultClasses.tableRowHeader]: table && table.head,
            [defaultClasses.tableRowFooter]: table && table.footer,
        },
        className,
    );

    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <tr
            className={classes}
            data-test="table-row"
            {...passOnProps}
        >
            {props.children}
        </tr>
    );
};

Row.contextTypes = {
    table: PropTypes.object,
};
