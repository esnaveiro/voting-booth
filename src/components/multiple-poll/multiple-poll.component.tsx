import { useEffect, useRef, createRef, RefObject } from 'react'
import styles from './multiple-poll.module.css'
import { manageVote, countPercentage, animateAnswers } from './utils'
export interface Result {
	id: number
	text: string
	votes: number
	percentage?: number
}
export interface Theme {
	mainColor?: string
	textColor?: string
	backgroundColor?: string
	alignment?: string
}

interface MultiplePollProps {
	question?: string
	results: Result[]
	theme?: Theme
	isVoted?: boolean
	isVotedId?: number
	onVote?(item: Result, results: Result[]): void
}

const MultiplePoll = ({
	question,
	results,
	theme,
	onVote,
	isVoted,
	isVotedId,
}: MultiplePollProps) => {
	const answerRefs = useRef<RefObject<HTMLDivElement>[]>(results.map(() => createRef<HTMLDivElement>()));

	useEffect(() => {
		if (isVoted) {
			countPercentage(results)
			animateAnswers(results, answerRefs, theme, undefined, isVotedId)
		}
	}, [isVoted, isVotedId, results, theme])

	return (
		<article
			className={styles.container}
			style={{ alignItems: theme?.alignment }}
		>
			{question && <h1 style={{ color: theme?.textColor }}>{question}</h1>}
			{results.map((result) => (
				<div
					key={result.id}
					role='button'
					id={'mulAnswer' + result.id}
					className={isVoted ? styles.answer : styles.answer_hover + ' ' + styles.answer}
					style={{ backgroundColor: theme?.backgroundColor }}
					onClick={() => {
						if (!isVoted) {
							manageVote(results, result, answerRefs, theme)
							onVote?.(result, results)
						}
					}}
				>
					<div
						ref={answerRefs.current[result.id]}
						className={styles.answerInner}
					>
						<p style={{ color: theme?.textColor }}>{result.text}</p>
					</div>
					{isVoted && (
						<span style={{ color: theme?.textColor }}>
							{result.votes}
						</span>
					)}
				</div>
			))}
		</article>
	)
}

export { MultiplePoll }
export type { MultiplePollProps }
