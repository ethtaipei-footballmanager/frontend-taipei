#!/bin/bash

# Instructions for script
# 1. Move script to file containing png you want to convert
# 2. Give it execute permissions using the command: chmod +x png_to_svg.sh.
# 3. Run the script in the directory where your PNG files are located: ./png_to_svg.sh.


# # Loop through each file in the current directory
# for file in *; do
#   # Check if the file is a PNG
#   if [[ $file == *.png ]]; then
#     echo "Converting $file to SVG..."
#     # Convert the PNG file to SVG and save it with the same name but with .svg extension
#     convert "$file" -background white -flatten -alpha off bmp:- | potrace --svg -o "${file%.png}.svg"
#     echo "$file converted."
#   fi
# done

# echo "All PNG files have been converted to SVG."


# Directories containing PNG files
directories=("jerseys" "players", "logos")

# Output directory for SVG files
output_dir="svg"

# Create the output directory if it doesn't exist
mkdir -p "$output_dir"

# Loop through each specified directory
for dir in "${directories[@]}"; do
  # Check if directory exists
  if [ -d "$dir" ]; then
    # Loop through PNG files in the directory
    for file in "$dir"/*.png; do
      # Check if file exists (in case of empty directory)
      if [ -f "$file" ]; then
        echo "Converting $file to SVG..."
        # Extract filename without extension
        filename=$(basename "$file" .png)
        # Convert the PNG file to SVG and save it in the output directory
        convert "$file" -background white -flatten -alpha off bmp:- | potrace --svg -o "$output_dir/$filename.svg"
        echo "$file converted."
      fi
    done
  else
    echo "Directory $dir does not exist."
  fi
done

echo "All PNG files in specified directories have been converted to SVG."
