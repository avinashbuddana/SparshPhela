"""
Standalone script to generate premium photorealistic images for Sparsh Pehla
using Gemini Nano Banana (gemini-2.5-flash-image) via the Google GenAI SDK.
Images are saved to /app/backend/media/<key>.png
Run: python generate_images.py <key> [<key> ...]   (only regenerates the keys listed, always overwriting)
     python generate_images.py                      (generates any keys with no existing file yet)
"""
import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MEDIA_DIR = ROOT_DIR / "media"
MEDIA_DIR.mkdir(exist_ok=True)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-2.5-flash-image"
client = genai.Client(api_key=API_KEY)

STYLE = (
    "Premium editorial photography, cinematic warm golden-hour lighting, soft shallow depth of field, "
    "warm ivory, soft beige and pastel peach color palette, emotionally rich and tender, calm and luxurious "
    "wellness atmosphere, authentic Indian family, photorealistic, high-end magazine quality, no text, no watermark."
)

IMAGES = {
    "hero": "A serene Indian expecting mother in a flowing soft beige dress gently cradling her pregnant belly near a sunlit window with sheer curtains, peaceful and radiant.",
    "intro": "Close-up of an Indian mother's hands tenderly holding her newborn baby's tiny feet, wrapped in a soft cream muslin blanket.",
    "about": "A graceful Indian woman wellness practitioner in elegant attire smiling warmly in a bright airy studio with plants and soft natural light.",
    "about_pregnancy": "An overjoyed Indian husband and wife sitting together on a sofa at home, both looking at a home pregnancy test kit in the wife's hands, sharing an emotional, tearful-with-happiness reaction to the positive result, warm intimate morning light.",
    "about_delivery": "The tender first moment right after childbirth in a hospital delivery room — an Indian father and mother together gently touching and looking at their newborn baby for the very first time, emotional and overwhelmed with love, soft warm delivery-room light, mother still in a hospital gown.",
    "family_counselling": "A warm Indian couple sitting together on a comfortable sofa in a softly lit calm room, in a caring conversation with a compassionate family counsellor seated in an armchair facing them, all three people clearly visible, gentle supportive atmosphere, expecting parents.",
    "garbh_sanskar": "A peaceful pregnant Indian woman meditating cross-legged with a soft glow, candles and flowers nearby, spiritual serene ambience.",
    "yoga": "A pregnant Indian woman practicing gentle prenatal yoga on a mat in a bright minimalist studio, soft morning light, calm and graceful pose.",
    "pre_shopping": "An Indian husband and wife happily shopping together for baby items in a bright modern baby-products store, browsing a rack of tiny clothes and a stroller together, smiling and pointing things out to each other, retail shelves with baby products in the background.",
    "photography": "An artistic maternity portrait of an Indian expecting mother in a flowing gown, soft dreamy backlight, elegant and cinematic.",
    "photography_alt": "An artistic maternity portrait of an Indian expecting mother in a flowing gown standing close together with her husband, his hand resting gently on her belly, both smiling tenderly at each other, soft dreamy backlight, elegant cinematic outdoor setting.",
    "baby_massage": "An elderly Indian Maharashtrian woman (traditional baby-massage 'maasi'), wearing a simple traditional cotton saree, gently giving an oil massage to a baby lying on a soft towel on her lap. Only the elderly woman and the baby are present in the frame, no mother or younger adult visible, warm intimate home lighting, authentic traditional atmosphere.",
    "wellness_program": "A relaxed pregnant Indian woman receiving a calming wellness session in a luxurious spa-like room with soft drapes and warm light.",
    "mother_care": "A caring scene of a new Indian mother resting peacefully while being supported, cozy warm bedroom, nurturing atmosphere.",
    "newborn": "A sleeping Indian newborn baby swaddled in soft cream cloth, tiny and peaceful, warm soft natural light.",
    "emotional_wellness": "A thoughtful Indian mother sitting calmly by a window with a cup of tea, soft contemplative mood, gentle warm light.",
    "parenting_workshop": "A small warm group of Indian parents sitting in a circle in a bright cozy room engaged in a friendly supportive workshop.",
    "lactation": "An Indian mother tenderly breastfeeding her newborn wrapped in a soft blanket, intimate peaceful warm lighting.",
    "postpartum": "A new Indian mother doing gentle gentle stretching recovery exercises in a serene bright room, calm and restorative.",
    "baby_care": "An Indian mother giving her baby a gentle warm bath in a soft towel-lined tub, tender caring moment, warm light.",
    "gallery1": "An Indian father gently kissing his pregnant wife's forehead, both smiling, intimate tender black-tie-free candid moment, warm light.",
    "gallery2": "Tiny Indian newborn hand wrapped around an adult finger, extreme close-up, soft warm tones, emotional.",
    "gallery3": "A joyful Indian mother lifting her laughing baby in the air in a sunlit garden, pure happiness.",
    "gallery4": "A peaceful pregnant Indian woman silhouette against a warm sunset window, contemplative and serene.",
    "cta": "Soft dreamy abstract background of warm ivory and pastel peach fabric folds with gentle golden light, no people.",
}


async def generate_one(key: str, prompt: str, force: bool = False):
    out_path = MEDIA_DIR / f"{key}.png"
    if out_path.exists() and not force:
        print(f"[skip] {key} already exists")
        return
    try:
        full_prompt = f"{prompt} {STYLE}"
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=[full_prompt],
        )
        image_bytes = None
        for part in response.candidates[0].content.parts:
            if getattr(part, "inline_data", None) is not None:
                image_bytes = part.inline_data.data
                break
        if image_bytes:
            with open(out_path, "wb") as f:
                f.write(image_bytes)
            print(f"[ok] saved {key}.png ({len(image_bytes)} bytes)")
        else:
            print(f"[warn] no image returned for {key}")
    except Exception as e:
        print(f"[error] {key}: {e}")


async def main():
    requested = sys.argv[1:]
    if requested:
        for key in requested:
            if key not in IMAGES:
                print(f"[error] unknown key: {key}")
                continue
            await generate_one(key, IMAGES[key], force=True)
    else:
        for key, prompt in IMAGES.items():
            await generate_one(key, prompt)
    print("DONE generating images")


if __name__ == "__main__":
    asyncio.run(main())
