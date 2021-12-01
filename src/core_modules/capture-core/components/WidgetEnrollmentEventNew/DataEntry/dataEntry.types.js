// @flow
import type { OrgUnit, RulesExecutionDependenciesClientFormatted } from '../common.types';
import type { ProgramStage, RenderFoundation } from '../../../metaData';

export type ContainerProps = {|
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    id: string,
    itemId: string,
    formRef: (formInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
|};

export type Props = $Diff<ContainerProps, {| orgUnit: OrgUnit |}>;
