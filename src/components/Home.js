import { Link } from 'react-router-dom'
import styles from './Home.module.css'


export default function Home() {
  return (
    <>
    <div className={styles.home}>
      <div className={styles.text_box}>
        <h1>WELCOME TO MYNEWS</h1>
        <div className={styles.btn_container}>
          <Link to="/registration" className={styles.register}>Registration</Link>
          <Link to="/login" className={styles.login}>Log In</Link>
        </div>
      </div>
    </div>
    </>
  )
}
