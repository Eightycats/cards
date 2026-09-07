#!/bin/bash

mkdir -p adjusted

# Target average brightness, from 0.0 to 1.0.
# Increase this if the whole collection still feels too dark.
TARGET=0.72

# Prevent extreme corrections.
MIN_GAMMA=0.75
MAX_GAMMA=1.40

for f in *.png; do
    mean=$(magick "$f" \
        -alpha off \
        -colorspace Gray \
        -format "%[fx:mean]" info:)

    gamma=$(awk \
        -v mean="$mean" \
        -v target="$TARGET" \
        -v min="$MIN_GAMMA" \
        -v max="$MAX_GAMMA" \
        'BEGIN {
            # For ImageMagick gamma:
            # output = input ^ (1/gamma)
            # Solve approximately so mean moves toward target.
            g = log(mean) / log(target)

            if (g < min) g = min
            if (g > max) g = max

            printf "%.4f", g
        }')

    echo "$f  mean=$mean  gamma=$gamma"

    magick "$f" \
        -gamma "$gamma" \
        "adjusted/$f"
done
