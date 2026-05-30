"""
Standalone script to generate premium photorealistic images for Sparsh Pehla
using Gemini Nano Banana (gemini-3.1-flash-image-preview) via emergentintegrations.
Images are saved to /app/backend/media/<key>.png
Run: python generate_images.py
"""
import asyncio
import os
import base64
import uuid
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MEDIA_DIR = ROOT_DIR / "media"
MEDIA_DIR.mkdir(exist_ok=True)

API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

STYLE = (
    "Premium editorial photography, cinematic warm golden-hour lighting, soft shallow depth of field, "
    "warm ivory, soft beige and pastel peach color palette, emotionally rich and tender, calm and luxurious "
    "wellness atmosphere, authentic Indian family, photorealistic, high-end magazine quality, no text, no watermark."
)

IMAGES = {
    "hero": "A serene Indian expecting mother in a flowing soft beige dress gently cradling her pregnant belly near a sunlit window with sheer curtains, peaceful and radiant.",
    "intro": "Close-up of an Indian mother's hands tenderly holding her newborn baby's tiny feet, wrapped in a soft cream muslin blanket.",
    "about": "A graceful Indian woman wellness practitioner in elegant attire smiling warmly in a bright airy studio with plants and soft natural light.",
    "family_counselling": "A warm Indian couple sitting together on a comfortable sofa in a softly lit calm room, holding hands and smiling gently, expecting parents.",
    "garbh_sanskar": "A peaceful pregnant Indian woman meditating cross-legged with a soft glow, candles and flowers nearby, spiritual serene ambience.",
    "yoga": "A pregnant Indian woman practicing gentle prenatal yoga on a mat in a bright minimalist studio, soft morning light, calm and graceful pose.",
    "pre_shopping": "Beautifully arranged premium baby essentials, soft knitted clothes, wooden toys and blankets in warm neutral tones on a clean surface.",
    "photography": "An artistic maternity portrait of an Indian expecting mother in a flowing gown, soft dreamy backlight, elegant and cinematic.",
    "baby_massage": "An Indian mother gently giving an oil massage to her smiling baby on a soft towel, warm intimate lighting, tender bonding moment.",
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


async def generate_one(key: str, prompt: str):
    out_path = MEDIA_DIR / f"{key}.png"
    if out_path.exists():
        print(f"[skip] {key} already exists")
        return
    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"sparsh-{key}-{uuid.uuid4()}",
            system_message="You are a premium photography image generator.",
        )
        chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
        full_prompt = f"{prompt} {STYLE}"
        msg = UserMessage(text=full_prompt)
        _, images = await chat.send_message_multimodal_response(msg)
        if images:
            image_bytes = base64.b64decode(images[0]["data"])
            with open(out_path, "wb") as f:
                f.write(image_bytes)
            print(f"[ok] saved {key}.png ({len(image_bytes)} bytes)")
        else:
            print(f"[warn] no image returned for {key}")
    except Exception as e:
        print(f"[error] {key}: {e}")


async def main():
    for key, prompt in IMAGES.items():
        await generate_one(key, prompt)
    print("DONE generating images")


if __name__ == "__main__":
    asyncio.run(main())
