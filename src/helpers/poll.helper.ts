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
