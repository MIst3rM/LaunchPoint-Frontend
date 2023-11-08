import { useEffect, useRef, useState } from 'react'

import styles from './styles.module.css'
import MenuContainer from '../Menu/MenuContainer/index.'
import Button from '../Button'

type NavOption = 'Dashboard' | 'Deployments' | 'Live View'

const Header = () => {

	const [selectedNavOption, setSelectedNavOption] = useState<NavOption | null>(null)
	const [selectedNavOptionPosition, setSelectedNavOptionPosition] = useState<{ x: number }>({ x: 0 })

	const dashboard = useRef<HTMLParagraphElement>(null)
	const deployments = useRef<HTMLParagraphElement>(null)
	const liveview = useRef<HTMLParagraphElement>(null)

	useEffect(() => {
		const glowEffects = document.querySelectorAll(".glowEffect");
		glowEffects.forEach((glowEffect) => {
			const glowLines = glowEffect.querySelectorAll("rect");
			const rx = getComputedStyle(glowEffect).borderRadius;

			glowLines.forEach((line) => {
				line.setAttribute("rx", rx);
			});
		});
	}, [])


	useEffect(() => {
		const resizeHandler = () => {
			if (selectedNavOption !== null || selectedNavOptionPosition.x !== 0) {
				setSelectedNavOptionPosition({ x: 0 })
				setSelectedNavOption(null)
			}
		}
		document.addEventListener('resize', resizeHandler)

		return () => document.removeEventListener('resize', resizeHandler)
	}, [selectedNavOption, selectedNavOptionPosition.x])



	const onNavOptionHover = (navItemId: NavOption) => {
		if (selectedNavOption === navItemId)
			return

		let navOptionScreenPosition: DOMRect

		switch (navItemId) {
			case 'Dashboard':
				if (dashboard === null || dashboard.current === null)
					return
				navOptionScreenPosition = dashboard.current.getBoundingClientRect()
				break
			case 'Deployments':
				if (deployments === null || deployments.current === null)
					return
				navOptionScreenPosition = deployments.current.getBoundingClientRect()
				break
			case 'Live View':
				if (liveview === null || liveview.current === null)
					return
				navOptionScreenPosition = liveview.current.getBoundingClientRect()
				break
			default:
				return
		}

		setSelectedNavOptionPosition({ x: navOptionScreenPosition.left + navOptionScreenPosition.width / 2 })
		setSelectedNavOption(navItemId)
	}


	const onMouseLeave = () => {
		setSelectedNavOption(null)
		setSelectedNavOptionPosition({ x: 0 })
	}


	const onNavOptionClicked = (navItemId: NavOption) => {
		selectedNavOption !== null ? onMouseLeave() : onNavOptionHover(navItemId)
	}


	return (
		<header className={styles.header}>
			<h1>LauchPoint.</h1>
			<div onMouseLeave={onMouseLeave} className={styles.navigationWrapper}>
				<nav className={styles.navigationItems}>
					<button
						onMouseEnter={() => onNavOptionHover('Dashboard')}
						onClick={() => onNavOptionClicked('Dashboard')}
						onFocus={() => onNavOptionHover('Dashboard')}
						onTouchStart={() => onNavOptionClicked('Dashboard')}
					>
						<p ref={dashboard}>Dashboard</p>
					</button>

					<button
						onMouseEnter={() => onNavOptionHover('Deployments')}
						onClick={() => onNavOptionClicked('Deployments')}
						onFocus={() => onNavOptionHover('Deployments')}
						onTouchStart={() => onNavOptionClicked('Deployments')}
					>
						<p ref={deployments}>Deployments</p>
					</button>

					<button
						onMouseEnter={() => onNavOptionHover('Live View')}
						onClick={() => onNavOptionClicked('Live View')}
						onFocus={() => onNavOptionHover('Live View')}
						onTouchStart={() => onNavOptionClicked('Live View')}
					>
						<p ref={liveview}>Live View</p>
					</button>
				</nav>
				<MenuContainer
					selectedNavOption={selectedNavOption}
					selectedNavOptionPosition={selectedNavOptionPosition}
				/>
			</div>
			<div className={styles.authButtonsWrapper}>
				<Button text='Sign Up' type='signup' />
				<Button text='Login' type='login' />
			</div>
		</header>
	)
}

export default Header