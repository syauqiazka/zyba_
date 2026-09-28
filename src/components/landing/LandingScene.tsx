import { Heart, MessageCircle, Sparkles } from "lucide-react";

export default function LandingScene() {
    return (
        <div className="landing-scene" aria-hidden="true">

            {/* SKY */}
            <div className="scene-sky" />

            {/* SUN GLOW */}
            <div className="scene-sun" />

            {/* CLOUDS */}
            <div className="scene-cloud cloud-one" />
            <div className="scene-cloud cloud-two" />

            {/* DISTANT TREES */}
            <div className="tree tree-one">
                <span className="tree-crown" />
                <span className="tree-trunk" />
            </div>

            <div className="tree tree-two">
                <span className="tree-crown" />
                <span className="tree-trunk" />
            </div>

            <div className="tree tree-three">
                <span className="tree-crown" />
                <span className="tree-trunk" />
            </div>

            {/* GROUND */}
            <div className="scene-ground">
                <div className="ground-line" />

                <span className="grass grass-one" />
                <span className="grass grass-two" />
                <span className="grass grass-three" />
                <span className="grass grass-four" />
            </div>

            {/* CHARACTER 1 */}
            <div className="scene-character character-one">
                <div className="character-shadow" />

                <div className="character-body">
                    <div className="character-head">
                        <span className="eye eye-left" />
                        <span className="eye eye-right" />
                    </div>

                    <div className="character-shirt" />

                    <div className="character-leg leg-left" />
                    <div className="character-leg leg-right" />
                </div>
            </div>

            {/* CHARACTER 2 */}
            <div className="scene-character character-two">
                <div className="character-shadow" />

                <div className="character-body">
                    <div className="character-head">
                        <span className="eye eye-left" />
                        <span className="eye eye-right" />
                    </div>

                    <div className="character-shirt character-shirt-orange" />

                    <div className="character-leg leg-left" />
                    <div className="character-leg leg-right" />
                </div>
            </div>

            {/* CHARACTER 3 */}
            <div className="scene-character character-three">
                <div className="character-shadow" />

                <div className="character-body">
                    <div className="character-head">
                        <span className="eye eye-left" />
                        <span className="eye eye-right" />
                    </div>

                    <div className="character-shirt character-shirt-brown" />

                    <div className="character-leg leg-left" />
                    <div className="character-leg leg-right" />
                </div>
            </div>

            {/* FLOATING UI DETAILS */}
            <div className="scene-bubble bubble-one">
                <MessageCircle size={14} />
            </div>

            <div className="scene-bubble bubble-two">
                <Heart size={13} />
            </div>

            <div className="scene-bubble bubble-three">
                <Sparkles size={12} />
            </div>

            {/* FLOWERS */}
            <div className="scene-flower flower-one">
                <span />
            </div>

            <div className="scene-flower flower-two">
                <span />
            </div>

            <div className="scene-flower flower-three">
                <span />
            </div>
        </div>
    );
}