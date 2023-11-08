import { forwardRef } from 'react'

import styles from './styles.module.css'


const DeploymentsCard = forwardRef<HTMLElement>((props, companyRef) => (
	<section className={styles.card} ref={companyRef}>
		<div className={styles.mainActions}>
			<ul>
				<li><p>Drone 1</p></li>
				<li><p>Drone 2</p></li>
				<li><p>Drone 3</p></li>
				<li><p>Drone 4</p></li>
			</ul>
		</div>

		<footer className={styles.footer}>
			<h5>Nothing to show </h5>
			<ul>
				<li><p>Test</p></li>
			</ul>
		</footer>
	</section>
))

export default DeploymentsCard