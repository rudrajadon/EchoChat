import { useEffect, useState } from "react";

const allImages = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80",
];

const fallbackImage = "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80";

const groups = [
  [0, 2, 4],
  [6, 8, 1],
  [3, 5, 7],
];

const FLIP_DURATION = 1500;
const IMAGE_VISIBLE_DURATION = 2700;
const CYCLE_DURATION = FLIP_DURATION + IMAGE_VISIBLE_DURATION;

const AuthImagePattern = ({ title, subtitle }) => {
  const [flipped, setFlipped] = useState(Array(9).fill(false));
  const [groupIndex, setGroupIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imgErrors, setImgErrors] = useState({});

  // Shuffle images once at start
  useEffect(() => {
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setImages(shuffled);
  }, []);

  useEffect(() => {
    const cycleFlip = () => {
      // Reset all to front
      setFlipped(Array(9).fill(false));

      // Flip group after a short delay
      setTimeout(() => {
        setFlipped((prev) => {
          const updated = [...prev];
          groups[groupIndex].forEach((idx) => {
            updated[idx] = true;
          });
          return updated;
        });
      }, 100);

      // Move to next group after cycle
      setTimeout(() => {
        setGroupIndex((prev) => (prev + 1) % groups.length);
      }, CYCLE_DURATION);
    };

    cycleFlip();
    const interval = setInterval(cycleFlip, CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [groupIndex]);

  const handleImageError = (index) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="aspect-square perspective rounded-2xl" style={{ perspective: "800px" }}>
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-[1500ms] ease-in-out ${
                  flipped[i] ? "rotate-y-180" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div className="absolute inset-0 rounded-2xl bg-primary/10 flex items-center justify-center backface-hidden" style={{ backfaceVisibility: "hidden" }}>
                  {i % 2 === 0 && <div className="animate-pulse w-full h-full rounded-2xl" />}
                </div>

                {/* Back */}
                <img
                  src={imgErrors[i] ? fallbackImage : images[i]}
                  alt={`Flip image ${i}`}
                  onError={() => handleImageError(i)}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl rotate-y-180 backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>

      <style>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;
