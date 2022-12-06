

const Header = () => {

    return (
        <>
        <header class="header">
              <div class="header__top">
                  <div class="container">
                      <div class="row">
                          <div class="col-lg-6 col-md-6">
                              <div class="header__top__left">
                                  <ul>
                                      <li> Good Sweat, Good Life!</li>
                                      <li> Join Toronto Fitness Club Right Now. </li>
                                  </ul>
                              </div>
                          </div>
                          <div class="col-lg-6 col-md-6">
                              <div class="header__top__right">
                                  <div class="header__top__right__auth">
                                      <a href="http://127.0.0.1:8000/studio/all"><i class="fa fa-user"></i> Login</a>
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