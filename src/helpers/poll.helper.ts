import { remove, ref, update } from "firebase/database";
import { db } from "..";
import { Result } from "../components/multiple-poll/multiple-poll.component";
import { DATABASE } from "../constants/firebase.const";
import { IPoll, IOption } from "../interfaces/poll-interface";
import { userService } from "../services/user.service";

/**
 * Returns the last key from an object
 * @param data
 */
export function getLastKey(data: Record<string, IPoll>): string {
    return Object.keys(data).slice(-1)[0];
}

/**
 * Checks for a given IPoll data if the current user has voted on any option and returns it if does find it
 * @param data
 * @param pollKey
 */
export function getUserVotedOption(data: IPoll): IOption | undefined {
    return data.options?.find((option) =>
        option.votes ?
            Object.keys(option.votes).find((key) => option.votes[key] === userService.getUser()) :
            false
    );
}

/**
 * Returns true when a given option has a valid id
 * @param data
 */
export function optionHasId(data: IOption | undefined): boolean {
    return typeof data?.id === 'number' && data.id >= 0;
}

/**
 * Converts options from database format to multiple poll component format
 * @param options
 */
export function convertOptionsFromDbToPoll(options: IOption[]) {
    return options.map((option) => ({ ...option, votes: Object.keys(option.votes || {}).length || 0 }));
}

/**
 * Removes old vote from database for the current poll
 * @param userVotedOption
 * @param pollKey
 */
export async function removeOldVote(userVotedOption: IOption | undefined, pollKey: string): Promise<void> {
    if (optionHasId(userVotedOption)) {
        await remove(
            ref(db, `${DATABASE.POLLS}/${pollKey}/options/${userVotedOption?.id}/votes/${userService.getUser()}`)
        ).catch((error) => console.error('Error removing old vote: ', error));
    }
}

/**
 * Adds the new vote to the database for the current poll
 * @param pollKey
 * @param item
 * @param userId
 */
export async function addNewVote(pollKey: string, item: Result, userId: string): Promise<void> {
    await update(
        ref(db, `${DATABASE.POLLS}/${pollKey}/options/${item.id}/votes`),
        { [userId]: userId }
    ).catch((error) => console.error('Error adding new vote: ', error));
}