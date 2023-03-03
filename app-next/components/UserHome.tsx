import UserHomeProps from '../type/UserHomeProps'
import UserProfile from './UserProfile'
import UserMoments from './UserMoments'
import style from './styles/UserHome.module.css'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'

const UserHome = ({ loginInfo, setLoginInfo, address }: UserHomeProps) => {
    return (
        <div className={style.userHome}>

            <UserProfile loginInfo={loginInfo} />

            {/* moments */}
            <UserMoments />

            {/* link to event start page */}
            <Link className={style.start} href={"/" + uuidv4()}>START</Link>

        </div>
    )
}

export default UserHome