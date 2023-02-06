import React from "react";
import rune from "../json/rune.json"
import summoner from "../json/summoner.json"

const RuneSpell = ({ rs, src }) => {

    
    if (rs == "rune") {
        return (
            <figure>
                <img src={`../img/${rs}/${src}.png`} alt="" />
                    {
                        rune.map((r,k) => {
                            if (r.id == src) {
                                return <figcaption key="k">{r.name} : {r.shortDesc}</figcaption>
                            }
                        })
                    }
            </figure>
        )
    } else {
        return (
            <figure>
                <img src={`../img/${rs}/${src}.png`} alt="" />
                {
                        summoner.map((r,k) => {
                            if (r.key == src) {
                                return <figcaption key="k">{r.name} : {r.shortDesc}</figcaption>
                            }
                        })
                }
            </figure>
        )
    }
};

export default RuneSpell;