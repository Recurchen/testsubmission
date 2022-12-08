import { redirect } from "react-router-dom";
import useToken from "../../useToken";

const Header = () => {
    var redirect;
    const token = useToken();
    if(token.token === null){
        redirect = (<a href="/login"><i className="fa fa-user"></i>Login </a>);
    }
    else {
        redirect = (<a href="/usercenter"><i className="fa fa-user"></i> User Center</a>);
        // TODO: redirect to user center
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