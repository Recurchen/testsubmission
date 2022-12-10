import { redirect } from "react-router-dom";
import useToken from "../../useToken";
import { useNavigate } from "react-router-dom";
import "./style.css"

const Header = () => {
    var redirect;
    const token = useToken();
    const navigate = useNavigate();
    const navToLogin = ()=>{
        navigate('/login')
    }

    const logout = () =>{
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        navToLogin();
    }

    if(token.token === null){
        redirect = (<a href="/login"><i className="fa fa-user"></i>Login </a>);
    }
    else {
        redirect = (
        <div className="auth_user">
        <a href="/usercenter"><i className="fa fa-user"></i> User Center</a>
        <button id="logout" onClick={logout}> Log Out</button>
        </div>);
    }
    return (
        <>
        <header className="header">
              <div className="header__top">
                  <div className="container">
                      <div className="row">
                          <div className="col-lg-6 col-md-6">
                              <div className="header__top__left">
                                  <ul>
                                      <li> Good Sweat, Good Life!</li>
                                      <li> Join Toronto Fitness Club Right Now. </li>
                                  </ul>
                              </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                              <div className="header__top__right">
                                  <div className="header__top__right__auth">
                                        { redirect }
                                      {/* <a href="http://127.0.0.1:8000/studio/all"><i class="fa fa-user"></i> Login</a> */}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </header>
        </>

    )
}
export default Header;