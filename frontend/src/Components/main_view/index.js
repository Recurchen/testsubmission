const Main_View = () => {

    return (
        <>
          <section class="hero">
              <div class="container">
                  <div class="row">
                      <div class="col-lg-3">
                          <div class="hero__categories">
                              <div class="hero__categories__all">
                                  <i class="fa fa-bars"></i>
                                  <span>Check out 👇</span>
                              </div>
                              <ul>
                                  <li><a href="./studios">Studios</a></li>
                                  <li><a href="./classes">Classes</a></li>
                                  <li><a href="./plans">Membership Plans</a></li>
                                  <li><a href="./aboutus">About Us</a></li>

                              </ul>
                          </div>
                      </div>
                      <div class="col-lg-9">
                          <div class="hero__item set-bg" data-setbg="assets/img/Banner.jpeg">
                              <div class="hero__text">
                                  <h2>Building confidence.<br />Building fitness.</h2>
                                 
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
        </>
    )
}
export default Main_View;