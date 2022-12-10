import './style.css'

const Classes = () => {
    return (
        <>
            <div className={'AboutUs'}>
                <div className="about-section" style={{textAlign:"center"}}>
                    <h1 style={{color:"white"}}>Chekcout Our Studios!</h1>
                    <p style={{color:"white"}}>
                        This is a web dev for CSC309 course project built for a gym.</p>

                </div>
                <h2 style={{textAlign:"center",color:"white"}}>sss</h2><br/>
                <div className="about-row" style={{textAlign:"center"}}>
                    <div className="about-column">
                        <div className="about-card">
                            {/*<img src="/w3images/team1.jpg" alt="Jane" style="width:100%">*/}
                            <div className="about-container">
                                <h2 style={{color:"white"}}>Runxin Zhuang</h2>
                                <p style={{color:"white"}}>UofT 3rd CS student</p>
                                <p style={{color:"white"}}>jasmine.zhuang@mail.utoronto.ca</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-column">
                        <div className="about-card">
                            <div className="about-container">
                                <h2>Ruofan Chen</h2>
                                <p className="about-title">UofT 4th CS student</p>
                                <p>ruofan.chen@mail.utoronto.ca</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-column">
                        <div className="about-card">
                            <div className="about-container">
                                <h2>Nora Xu</h2>
                                <p className="about-title">UofT 3rd CS student</p>
                                <p>nnuo.xu@mail.utoronto.ca</p>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 style={{textAlign:"center",color:"white"}}>Our Fitness Classes</h2>
                <div className={'ourFitnessClass-section'}><br/>
                    {/*<hr style={{background:"white",width:500}}/>*/}
                    <p style={{color:"white"}}>	With 30+ classes to choose from,
                        there’s a class for everyone at TFC.</p>

                    <div className="classType-row" style={{textAlign:"center"}}>
                        <div className="classType-column">
                            <div className="classType-card">
                                <div className="classType-container">
                                    <h2 style={{color:"white"}}>Yoga</h2>
                                    <p style={{color:"white"}}>Find your center. <br/>Mind and Body.</p>


                                </div>
                            </div>
                        </div>
                        <div className="classType-column">
                            <div className="classType-card">
                                <div className="classType-container">
                                    <h2 style={{color:"white"}}>Cycling</h2>
                                    <p style={{color:"white"}}>Low impact.  <br/>High intensity.</p>
                                </div>
                            </div>
                        </div>
                        <div className="classType-column">
                            <div className="classType-card">
                                <div className="classType-container">
                                    <h2 style={{color:"white"}}>Cardio</h2>
                                    <p style={{color:"white"}}>Get your heart pumping. <br/> Boost your immune system.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p style={{textAlign:"center",color:"white"}}> To see more, checkout our
                        <a href="/"><i> classes page</i></a> .</p>
                    <br/>

                </div>



            </div>



        </>
    )
}
export default Classes;