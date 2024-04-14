import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/auth';
import { BsPersonCircle } from "react-icons/bs";
import { motion } from "framer-motion";
import styles from './styles.module.css'
import Button from '../Button'
import textConstants from '../../textConstants'

const ulVariants = {
	open: {
		clipPath: "inset(0% 0% 0% 0% round 10px)",
		transition: {
			type: "spring",
			bounce: 0,
			duration: 0.5,
		}
	},
	closed: {
		clipPath: "inset(0% 0% 100% 100% round 10px)",
		transition: {
			type: "spring",
			bounce: 0,
			duration: 0.5,
		}
	},
};

const calculateDelay = (index, startDelay = 0.15, staggerDuration = 0.1) => startDelay + index * staggerDuration;

const getLiTransition = (index, isOpen) => ({
	delay: isOpen ? calculateDelay(index) : 0,
	duration: 0.2,
});

const liVariants = {
	open: {
		opacity: 1,
		scale: 1,
		filter: "blur(0px)",
	},
	closed: {
		opacity: 0,
		scale: 0.3,
		filter: "blur(20px)",
	},
};


const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { loggedInUser, logout } = useAuth();

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

	return (
		<header className={styles.header} style={{
			justifyContent: loggedInUser ? 'center' : 'space-between'
		}}>
			<h1>{textConstants.app.name}</h1>
			{loggedInUser &&
				<>
					<div className={styles.navigationWrapper}>
						<nav className={styles.navigationItems}>
							<button>
								<Link to="/">
									<p>{textConstants.navBarOptions.option1}</p>
								</Link>
							</button>

							<button>
								<Link to="/deployments">
									<p>{textConstants.navBarOptions.option2}</p>
								</Link>
							</button>

							<button>
								<Link to="/livemap">
									<p>{textConstants.navBarOptions.option3}</p>
								</Link>
							</button>
						</nav>
					</div>
					<motion.nav className={styles.menu} initial="closed" animate={isOpen ? "open" : "closed"}>
						<div
							style={{
								width: 100,
								height: 140,
							}}
						/>
						<motion.button
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								display: 'flex',
								justifyContent: 'center',
							}}
							onClick={() => setIsOpen(!isOpen)}
						>
							<BsPersonCircle style={{
								fontSize: '1.5rem',
								color: 'white'
							}} />
						</motion.button>
						<motion.ul
							className={styles.profileMenu}
							variants={ulVariants}
							initial="closed"
							animate={isOpen ? "open" : "closed"}
							style={{
								pointerEvents: isOpen ? "auto" : "none",
							}}
						>
							{["Account", "Logout"].map((item, index) => (
								<motion.li
									key={item}
									className={styles.profileMenuItem}
									variants={liVariants}
									initial="closed"
									animate={isOpen ? "open" : "closed"}
									exit="closed"
									custom={index}
									transition={getLiTransition(index, isOpen)}
									whileHover={{ scale: 1.1 }}
									onClick={item === "Logout" ? logout : undefined}
								>
									{item}
								</motion.li>
							))}
						</motion.ul>

					</motion.nav>
				</>
			}
			{
				!loggedInUser &&
				<div className={styles.authButtonsWrapper}>
					<Button text={textConstants.buttons.signup[1]} type='signup' layoutId='signupLayout' />
					<Button text={textConstants.buttons.login[1]} type='login' layoutId='loginLayout' />
				</div>
			}
		</header >
	)
}

export default Header