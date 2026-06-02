"""
Generazione video AI locale con diffusers + PyTorch MPS (Apple Silicon)
Uso: python3 generate_local.py "prompt" output.mp4 1000 1000 5

100% gratuito, usa GPU del Mac.
"""

import sys, os, json
import torch

def main():
    prompt = sys.argv[1] if len(sys.argv) > 1 else "a cat walking"
    output_path = sys.argv[2] if len(sys.argv) > 2 else "output.mp4"
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 1000
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 1000
    duration = int(sys.argv[5]) if len(sys.argv) > 5 else 5

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"[local] Device: {device}, Size: {width}x{height}, Duration: {duration}s")

    if device == "cpu":
        print("[local] ATTENZIONE: CPU sarà molto lento. Consigliato Mac Apple Silicon.")
        print("[local] Fallback a Hugging Face Inference API per velocità.")

    try:
        from diffusers import CogVideoXPipeline
        from diffusers.utils import export_to_video
    except ImportError:
        print("ERROR: Installa diffusers: pip install diffusers torch transformers accelerate")
        sys.exit(1)

    model_name = os.environ.get("MODEL_NAME", "THUDM/CogVideoX-5B")

    print(f"[local] Caricamento {model_name}...")
    pipe = CogVideoXPipeline.from_pretrained(
        model_name,
        torch_dtype=torch.float16 if device != "cpu" else torch.float32,
    )
    pipe.to(device)
    pipe.enable_model_cpu_offload()
    pipe.enable_sequential_cpu_offload()

    print(f"[local] Generazione video da prompt: {prompt[:80]}...")
    video_frames = pipe(
        prompt=prompt,
        num_frames=duration * 8,
        width=width,
        height=height,
        guidance_scale=7,
        num_inference_steps=50,
        generator=torch.Generator(device=device).manual_seed(42),
    ).frames[0]

    print(f"[local] Salvataggio {output_path}...")
    export_to_video(video_frames, output_path, fps=8)
    print(f"[local] Completato: {output_path}")
    sys.exit(0)

if __name__ == "__main__":
    main()
