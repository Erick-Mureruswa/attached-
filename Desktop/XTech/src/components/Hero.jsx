import { SplitText } from 'gsap/all'
import gsap from "gsap"
import { useGSAP } from '@gsap/react'

const Hero = () => {
   useGSAP(() => {
       const heroSplit = new SplitText('.title',{type: 'chars, words'});
       const paragraphSplit = new SplitText('.subtitle', {type: 'lines'});

        heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

        gsap.from(heroSplit.chars, {
            yPercent: 100,
            duration: 1.8,
            stagger:0.06,
            ease: 'expo.out'
        });

        gsap.from(paragraphSplit.lines, {
            yPercent:100,
            delay: 1,
            duration: 1.8,
            ease: 'expo.out',
            stagger: 0.06,
            opacity: 0
        });

        gsap.timeline({
            scrollTrigger:{
                trigger: "#hero",
                start : 'top top',
                end: "bottom top",
                scrub: true
            }
        })
        .to('.right-leaf', {y:200}, 0)
        .to('.left-leaf',{y:-200},0)
   },[])
  return (
   <>
   <section id="hero" className='noisy'>
    <h1 className='title'>NADOTECH</h1>
      <img
        src='/images/hero-left-leaf.png'
        className='right-leaf'
        
      />
      <img src="/images/hero-left-leaf.png" alt="left-leaf" 
      className='left-leaf'
      />
    <div className="body">
        <div className="content">
            <div className='space-y-5 hidden md:block'>
            <p>Web Dev, AI Automation,Software Development</p>
            <p className='subtitle'>
                Create Immersive <br/> Browsing for your brand
            </p>
            </div>
            <div className="view-cocktails">
                <p className='subtitle'>
                    Our Software Services are engineered specifically for your brand's needs-designed to give brands identity
                </p>
                <a href='#pricing'>View Projects</a>
            </div>
        </div>
    </div>

   </section>
   </>
  )
}

export default Hero
