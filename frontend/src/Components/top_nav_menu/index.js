const Top_Nav_Menu = () => {

    return (
        <>
        <div class="container">
                  <div class="row">
                      <div class="col-lg-3">
                          <div class="header__logo">
                              <a href="/" class="logo">Toronto Fitness Center</a>
                          </div>
                      </div>
                      <div class="col-lg-6">
                          <nav class="header__menu" >
                              <ul>
                                  <li className="active"><a href="/">Home</a></li>
                                  <li><a href="/studios">Studios</a></li>
                                  <li><a href="src/Components/top_nav_menu/index#">Classes</a></li>
                                  <li><a href="/plans">Membership Plans</a></li>
                                  <li><a href="/aboutus">About Us</a></li>
                              </ul>
                          </nav>
                      </div>
                  </div>
                  <div class="humberger__open">
                      <i class="fa fa-bars"></i>
                  </div>
              </div>
        </>
    )
}
export default  Top_Nav_Menu;