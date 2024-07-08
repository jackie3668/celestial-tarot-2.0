import React from 'react'
import { Link } from 'react-router-dom';
import WaterWave from "react-water-wave";
import './Home.css'
import background from '../../assets/images/reading.png'
import star from '../../assets/ui/star.png'
import arrow from '../../assets/ui/arrow_cricle.png'

const Home = () => {
  return (
    <div className='home'>
      <WaterWave 
        className='ripple-container' 
        imageUrl={background}
        dropRadius={50}
        perturbance={0.01}
        resolution={256}
        interactive={true}
      >
        {({ drop }) => ( 
        <div className="content">
          <div className="left">
            <div>
              <img src={star} alt="" />
              <p>ECHOES OF</p>
              <span>THE STARS</span>
            </div>
            <div>
              Celestial
            </div>
            <div>
              begins here
            </div>
          </div>
          <div className="right">
            <div>
              <img src={star} alt="" />
              <p><span>Stars </span>illumination your<br /><span>Celestial path</span></p>
            </div>
            <div>
              <Link to='./reading'>
                CLICK TO BEGIN <img src={arrow} alt="" />
              </Link>
            </div>
          </div>
        </div>
        )}
      </WaterWave>
    </div>
  )
}

export default Home