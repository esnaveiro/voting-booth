import { push, child, ref, update } from "firebase/database";
import { db } from "..";
import { DATABASE } from "../constants/firebase.const";
import { IValues } from "../interfaces/form-interface";

/**
 * Inserts a new poll into the database
 * @param values
 */
export async function insertNewPoll(values: IValues): Promise<string> {
    const newPollKey = push(child(ref(db), DATABASE.POLLS)).key || '';
    const updates = {
        [DATABASE.POLLS + '/' + DATABASE.POLL + newPollKey]: {
            question: values.question,
            options: values.options.map((option, i) => ({ id: i, text: option })),
            showPoll: false,
            showResults: false,
        }
    }
    await update(ref(db), updates);

    return newPollKey;
}

/**
 * Updates switch status in the database
 * @param show
 * @param option
 * @param pollKey
 */
export function updateSwitchStatus(show: boolean, option: string, pollKey: string): void {
    const updates = {
        [DATABASE.POLLS + '/' + pollKey + '/show' + option]: show,
    }
    update(ref(db), updates);
}