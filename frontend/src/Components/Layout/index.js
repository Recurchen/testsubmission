import {Link, Outlet} from "react-router-dom";
import './style.css'

const Layout = () => {
    return (
        <>
            <nav>
                <Link to="/classes">Class Instances </Link>
                <Link to="/enrollments"> Enrollment History </Link>
                {/*<Link to="/ClassInstances/filter">Filter Class Instances</Link>*/}
            </nav>
            <Outlet />
        </>
    )
}

export default Layout;