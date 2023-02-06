import React, { useRef } from "react";

function GoTop() {

    const TT = useRef();
    
    window.addEventListener("scroll", () => {
        if (window.scrollY == 0 ) {
            TT.current.style = "opacity:0"
        } else{
            TT.current.style = "opacity:1"
        }
    })

    return (
        
        <button className="Top" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} ref={TT}>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M22.5 40V13.7L10.1 26.1 8 24 24 8l16 16-2.1 2.1-12.4-12.4V40Z"/></svg>
        </button>
    )
}

export default GoTop;


