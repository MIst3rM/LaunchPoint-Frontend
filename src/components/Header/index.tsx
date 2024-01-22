import { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom";

import styles from './styles.module.css'
import MenuContainer from '../Menu/MenuContainer'
import Button from '../Button'
import textConstants from '../../textConstants'
import { NavOption, AuthDialogType } from '../../types'
import AuthDialog from '../Dialog/AuthDialog'

const Header = () => {
	const [selectedNavOption, setSelectedNavOption] = useState<NavOption | null>(null)
	const [selectedNavOptionPosition, setSelectedNavOptionPosition] = useState<{ x: number }>({ x: 0 })
	//TODO: Replace this with a proper authentication check
	const [isSignedIn, setIsSignedIn] = useState(true);
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
	const [activeAuthType, setActiveAuthType] = useState<AuthDialogType>('login');

	const option1 = useRef<HTMLParagraphElement>(null)
	const option2 = useRef<HTMLParagraphElement>(null)
	const option3 = useRef<HTMLParagraphElement>(null)

	const handleShowAuthDialog = (type?: AuthDialogType) => {
		if (type) {
			setActiveAuthType(type);
		}
		setIsAuthDialogOpen(!isAuthDialogOpen);
	};

	useEffect(() => {
		const glowEffects = document.querySelectorAll(".glowEffect");
		glowEffects.forEach((glowEffect) => {
			const glowLines = glowEffect.querySelectorAll("rect");
			const rx = getComputedStyle(glowEffect).borderRadius;

			glowLines.forEach((line) => {
				line.setAttribute("rx", rx);
			});
		});
	}, [isAuthDialogOpen])


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
			case textConstants.navBarOptions.option1:
				if (option1 === null || option1.current === null)
					return
				navOptionScreenPosition = option1.current.getBoundingClientRect()
				break
			case textConstants.navBarOptions.option2:
				if (option2 === null || option2.current === null)
					return
				navOptionScreenPosition = option2.current.getBoundingClientRect()
				break
			case textConstants.navBarOptions.option3:
				if (option3 === null || option3.current === null)
					return
				navOptionScreenPosition = option3.current.getBoundingClientRect()
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

	const handleNavOptionInteraction = (option: NavOption) => {
		// This function will handle hover and focus events
		const handleInteraction = () => {
			onNavOptionHover(option);
		};

		// This function will handle click events
		const handleClick = () => {
			onNavOptionClicked(option);
		};

		return {
			onMouseEnter: handleInteraction,
			onFocus: handleInteraction,
			onClick: handleClick,
			onTouchStart: handleClick
		};
	};


	return (
		<header className={styles.header} style={{
			justifyContent: isSignedIn ? 'center' : 'space-between'
		}}>
			<h1>{textConstants.app.name}</h1>
			{isSignedIn &&
				<div onMouseLeave={onMouseLeave} className={styles.navigationWrapper}>
					<nav className={styles.navigationItems}>
						<button {...handleNavOptionInteraction('Dashboard')}>
							<p ref={option1}>{textConstants.navBarOptions.option1}</p>
						</button>

						<button {...handleNavOptionInteraction('Deployments')}>
							<p ref={option2}>{textConstants.navBarOptions.option2}</p>
						</button>

						<button {...handleNavOptionInteraction('Live View')}>
							<p ref={option3}>{textConstants.navBarOptions.option3}</p>
						</button>
					</nav>
					<MenuContainer
						selectedNavOption={selectedNavOption}
						selectedNavOptionPosition={selectedNavOptionPosition}
					/>
				</div>
			}
			{!isSignedIn &&
				<div className={styles.authButtonsWrapper}>
					{!isAuthDialogOpen &&
						<>
							<Button text={textConstants.buttons.signUp[1]} type='signup' layoutId='signupLayout' showDialog={() => handleShowAuthDialog('signup')} />
							<Button text={textConstants.buttons.login[1]} type='login' layoutId='loginLayout' showDialog={() => handleShowAuthDialog('login')} />
						</>
					}
					{isAuthDialogOpen &&
						<>
							{activeAuthType === 'login' &&
								<Button text={textConstants.buttons.signUp[1]} type='signup' layoutId='signupLayout' showDialog={() => handleShowAuthDialog('signup')} />
							}
							{activeAuthType === 'signup' &&
								<Button text={textConstants.buttons.login[1]} type='login' layoutId='loginLayout' showDialog={() => handleShowAuthDialog('login')} />
							}
							<AuthDialog type={activeAuthType} layoutId={`${activeAuthType}Layout`} isOpen={isAuthDialogOpen} showDialog={() => handleShowAuthDialog(undefined)} />
						</>
					}
				</div>
			}
		</header>
	)
}

export default Header