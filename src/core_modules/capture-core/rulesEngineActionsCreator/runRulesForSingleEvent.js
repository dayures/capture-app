// @flow
import log from 'loglevel';
import { RulesEngine } from '../../capture-core-utils/RulesEngine';
import { errorCreator } from '../../capture-core-utils';
import { Program, EventProgram, RenderFoundation, DataElement } from '../metaData';
import constantsStore from '../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../metaDataMemoryStores/optionSets/optionSets.store';
import type {
    DataElement as DataElementForRulesEngine,
    EventsData,
    EventData,
    OrgUnit,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';

const errorMessages = {
    PROGRAM_OR_FOUNDATION_MISSING: 'Program or foundation missing',
};

function getEventDataElements(eventProgram: EventProgram): Array<DataElement> {
    return eventProgram.stage ?
        Array.from(eventProgram.stage.stageForm.sections.values()).reduce((accElements, section) =>
            [...accElements, ...Array.from(section.elements.values())], []) :
        [];
}

function getRulesEngineDataElementsAsObject(
    dataElements: Array<DataElement>): { [elementId: string]: DataElementForRulesEngine } {
    return dataElements.reduce((accRulesDataElements, dataElement) => {
        accRulesDataElements[dataElement.id] = {
            id: dataElement.id,
            valueType: dataElement.type,
            optionSetId: dataElement.optionSet && dataElement.optionSet.id,
        };
        return accRulesDataElements;
    }, {});
}

function getDataElements(program: Program) {
    let dataElements: Array<DataElement> = [];

    if (program instanceof EventProgram) {
        dataElements = getEventDataElements(program);
    }

    return getRulesEngineDataElementsAsObject(dataElements);
}

// historically this function used to take care of event by stage and
// after some refactoring `byStage` is still here to avoid introducing bugs
function getEventsData(eventsData: ?EventsData) {
    if (eventsData && eventsData.length > 0) {
        return { all: eventsData, byStage: {} };
    }
    return null;
}

function prepare(
    program: ?Program,
    foundation: ?RenderFoundation,
    allEventsData: ?EventsData,
) {
    if (!program || !foundation) {
        log.error(errorCreator(errorMessages.PROGRAM_OR_FOUNDATION_MISSING)(
            { program, foundation, method: 'getRulesActionsForEvent' }),
        );
        return null;
    }

    const { programRuleVariables } = program;
    const programRules = [...program.programRules, ...foundation.programRules];

    if (!programRules || programRules.length === 0) {
        return null;
    }

    const constants = constantsStore.get();
    const optionSets = optionSetsStore.get();
    const dataElementsInProgram = getDataElements(program);
    const allEvents = getEventsData(allEventsData);

    return {
        optionSets,
        dataElementsInProgram,
        programRulesVariables: programRuleVariables,
        programRules,
        constants,
        allEvents,
    };
}

export default function runRulesForSingleEvent(
    program: ?Program,
    foundation: ?RenderFoundation,
    orgUnit: OrgUnit,
    currentEvent: EventData,
    allEventsData: EventsData,
) {
    const data = prepare(program, foundation, allEventsData);

    if (data) {
        const {
            optionSets,
            programRulesVariables,
            programRules,
            constants,
            dataElementsInProgram,
            allEvents,
        } = data;

        // returns an array of effects that need to take place in the UI.
        return RulesEngine.programRuleEffectsForEvent(
            { programRulesVariables, programRules, constants },
            { currentEvent, allEvents },
            dataElementsInProgram,
            orgUnit,
            optionSets,
        );
    }
    return null;
}

