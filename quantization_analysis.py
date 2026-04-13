import os
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Directory to save the output artifacts
output_dir = "quantization_output"
os.makedirs(output_dir, exist_ok=True)

def generate_gradient_image():
    """Generate a synthetic test image with a continuous radial gradient."""
    # Radial circular gradient spanning full 0-255 range
    x = np.linspace(-1, 1, 800)
    y = np.linspace(-1, 1, 800)
    X, Y = np.meshgrid(x, y)
    R = np.sqrt(X**2 + Y**2)
    img = np.cos(R * 10) * 127 + 128
    
    # Add a small amount of Gaussian noise to ensure even histogram distribution
    noise = np.random.normal(0, 10, img.shape)
    img = np.clip(img + noise, 0, 255).astype(np.uint8)
    return img

def quantize_bits(img, levels):
    """Simulate bit depth reduction by scaling values into 'levels' uniform bands."""
    q = np.round((img / 255.0) * (levels - 1))
    return np.round(q / (levels - 1) * 255.0).astype(np.uint8)

def plot_histogram(img, title, filename, gap_lim=None):
    """Plot the intensity distribution showing empty gap artifacts."""
    plt.figure(figsize=(10, 4))
    plt.hist(img.ravel(), bins=256, range=[0, 256], color='steelblue', alpha=0.9)
    plt.title(title)
    plt.xlabel('Pixel Intensity')
    plt.ylabel('Frequency')
    
    if gap_lim:
        plt.xlim(gap_lim)
        
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, filename))
    plt.close()

def main():
    print(f"Creating quantization images in: ./{output_dir}/")
    img = generate_gradient_image()
    cv2.imwrite(os.path.join(output_dir, "original_8bit.png"), img)
    plot_histogram(img, "8-bit (Original) Histogram", "hist_8bit.png")

    # Task 1.1: Create Quantized Versions
    # 5-bit (32 levels), 4-bit (16 levels), 3-bit (8 levels)
    print("Quantizing bit depths...")
    img_5bit = quantize_bits(img, 32)
    img_4bit = quantize_bits(img, 16)
    img_3bit = quantize_bits(img, 8)

    cv2.imwrite(os.path.join(output_dir, "img_5bit.png"), img_5bit)
    cv2.imwrite(os.path.join(output_dir, "img_4bit.png"), img_4bit)
    cv2.imwrite(os.path.join(output_dir, "img_3bit.png"), img_3bit)

    # Task 1.2: Analyze Histograms
    print("Plotting basic quantization histograms...")
    plot_histogram(img_5bit, "5-bit Quantized (32 levels)", "hist_5bit.png")
    plot_histogram(img_4bit, "4-bit Quantized (16 levels)", "hist_4bit.png")
    plot_histogram(img_3bit, "3-bit Quantized (8 levels)", "hist_3bit.png")

    plot_histogram(img_5bit, "5-bit Quantized (Zoomed 0-100)", "hist_5bit_zoomed.png", gap_lim=[0, 100])

    # Task 1.4: Double Quantization (Comb Pattern Simulation)
    print("Running Double Quantization Simulation...")
    # Step 1: Quantize to 5-bit
    q1 = quantize_bits(img, 32)
    
    # Step 2: Re-quantize that 5-bit mapping directly to a new 6-bit constraint map 
    q1_q2 = quantize_bits(q1, 64)
    
    # Compare with a direct 8-bit -> 6-bit constraint
    q_direct = quantize_bits(img, 64)

    plot_histogram(q1_q2, "Double Quantization (8->5->6 bit)", "hist_double_quant.png", gap_lim=[0, 70])
    plot_histogram(q_direct, "Single Quantization (8->6 bit)", "hist_single_quant.png", gap_lim=[0, 70])

    cv2.imwrite(os.path.join(output_dir, "img_double_quant.png"), q1_q2)
    cv2.imwrite(os.path.join(output_dir, "img_single_quant.png"), q_direct)
    print("Done! Check the output directory for results.")

if __name__ == "__main__":
    main()
