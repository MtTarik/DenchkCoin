import styles from './Header.module.css'
const Header = () =>{


    return (
        <div className={styles.containerHeader}>
            <h1 className={styles.title}>Коін для повернення боргів корішу!</h1>
            <div>
                <p className={styles.parag}>Добувай Denchk COIN якщо нема що отдать а він вийобуеться</p>

            </div>
        </div>

    )
        ;
}
export default Header
