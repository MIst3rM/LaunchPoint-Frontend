import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'
import styles from './styles.module.css'

import DeploymentsCard from "../Cards/Deployments";
import { MenuContainerProps } from "../../../types";

const MenuContainer = ({ selectedNavOption, selectedNavOptionPosition }: MenuContainerProps) => {

	const dashboard = useRef<HTMLElement | null>(null)
	const deployments = useRef<HTMLElement>(null)
	const liveview = useRef<HTMLElement>(null)

	const containerWidth = useMotionValue<number | null>(null)
	const containerHeight = useMotionValue<number | null>(null)

	const [isFirstInteraction, setIsFirstInteraction] = useState(true)


	useEffect(() => {
		if (selectedNavOption !== null)
			setIsFirstInteraction(false)
		else
			setIsFirstInteraction(true)
	}, [selectedNavOption])

	useLayoutEffect(() => {
		if (!selectedNavOption)
			return

		let width: number, height: number

		switch (selectedNavOption) {
			case 'Dashboard':
				if (dashboard === null || dashboard.current === null)
					return
				width = dashboard.current.clientWidth
				height = dashboard.current.clientHeight
				break
			case 'Deployments':
				if (deployments === null || deployments.current === null)
					return
				width = deployments.current.clientWidth
				height = deployments.current.clientHeight
				break
			case 'Live View':
				if (liveview === null || liveview.current === null)
					return
				width = liveview.current.clientWidth
				height = liveview.current.clientHeight
				break
			default:
				return
		}
		containerWidth.set(width)
		containerHeight.set(height)
	}, [selectedNavOption, containerWidth, containerHeight])

	const cardProps = {
		className: styles.card,
		initial: { opacity: 0, x: isFirstInteraction ? 0 : -60 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: isFirstInteraction ? 0 : -60 },
		transition: { type: 'spring', stiffness: 80, damping: 14 }
	}

	return (
		<AnimatePresence mode="wait">
			{selectedNavOption !== null && (
				<motion.div
					className={styles.menuWrapper}
					style={{ originX: 0.5, originY: 0, transformPerspective: 1000, height: window.innerHeight }}
					initial={{ opacity: 0, rotateX: -13 }}
					animate={{ opacity: 1, rotateX: 0 }}
					exit={{ opacity: 0, rotateX: -13 }}
					transition={{ duration: 0.15, ease: 'linear' }}
				>
					<motion.div
						className={styles.menuBody}
						style={{
							width: containerWidth,
							height: containerHeight,
							transition: isFirstInteraction ? '0' : '0.3s'
						}}
					>
						<div
							className={styles.arrow}
							style={{ left: selectedNavOptionPosition.x - 6 }}  /* [6 -> half of arrow width] */
						/>

						<div className={styles.menuContent}>
							<AnimatePresence mode="wait">
								{selectedNavOption === 'Deployments' && (
									<motion.div {...cardProps}>
										<DeploymentsCard ref={deployments} />
									</motion.div>
								)}
							</AnimatePresence>
						</div>

					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default MenuContainer;