const Top_Nav_Menu = () => {

    return (
        <>
        <div className="container">
                  <div className="row">
                      <div className="col-lg-3">
                          <div className="header__logo">
                              <a href="src/Components/top_nav_menu/index#" className="logo">Toronto Fitness Center</a>
                          </div>
                      </div>
                      <div className="col-lg-6">
                          <nav className="header__menu" >
                              <ul>
                                  {/*<li class="active"><a href="src/Components/top_nav_menu/index#">Home</a></li>*/}
                                  <li className="active"><a href="/">Home</a></li>
                                  <li><a href="src/Components/top_nav_menu/index#">Studios</a></li>
                                  <li><a href="src/Components/top_nav_menu/index#">Classes</a></li>
                                  {/*<li><a href="src/Components/top_nav_menu/index#">Membership Plans</a></li>*/}
                                  <li><a href="/plans">Membership Plans</a></li>
                                  {/*<li><a href="src/Components/top_nav_menu/index#">User Center</a></li>*/}
                              </ul>
                          </nav>
                      </div>
                  </div>
                  <div className="humberger__open">
                      <i className="fa fa-bars"></i>
                  </div>
              </div>
        </>
    )
}
export default  Top_Nav_Menu;