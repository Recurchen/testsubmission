import './style.css'

const AboutUs = () => {
    return (
        <>
            <div className={'AboutUs'}>
                <div className="about-section" style={{textAlign:"center"}}>
                    <h1 style={{color:"white"}}>About Us</h1>
                    <p style={{color:"white"}}> This is a web dev for CSC309 course project built for a gym.</p>

                </div>

                <h2 style={{textAlign:"center",color:"white"}}>Our Team</h2>
                <div className="about-row" style={{textAlign:"center"}}>
                    <div className="about-column">
                        <div className="about-card">
                            {/*<img src="/w3images/team1.jpg" alt="Jane" style="width:100%">*/}
                            <div className="about-container">
                                <h2 style={{color:"white"}}>Runxin Zhuang</h2>
                                <p style={{color:"white"}}>UofT 3rd CS student</p>
                                <p style={{color:"white"}}>jasmine.zhuang@mail.utoronto.ca</p>
                                {/*<p><button class="button">Contact</button></p>*/}
                            </div>
                        </div>
                    </div>

                    <div className="about-column">
                        <div className="about-card">
                            {/*<img src="/w3images/team2.jpg" alt="Mike" style="width:100%">*/}
                            <div className="about-container">
                                <h2>Ruofan Chen</h2>
                                <p className="about-title">UofT 4th CS student</p>
                                <p>ruofan.chen@mail.utoronto.ca</p>
                                {/*<p><button class="button">Contact</button></p>*/}
                            </div>
                        </div>
                    </div>

                    <div className="about-column">
                        <div className="about-card">
                            {/*<img src="/w3images/team3.jpg" alt="John" style="width:100%">*/}
                            <div className="about-container">
                                <h2>Nora Xu</h2>
                                <p className="about-title">UofT 3rd CS student</p>
                                <p>nnuo.xu@mail.utoronto.ca</p>
                                {/*<p><button class="button">Contact</button></p>*/}
                            </div>
                        </div>
                    </div>
                </div>

            </div>



        </>
    )
}
export default  AboutUs;