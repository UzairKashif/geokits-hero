# Example: How to Add Images to Your Blog Posts

You can now embed images anywhere in your blog content using this simple syntax:

## Basic Image Syntax
```
![Alt text for accessibility](image_url)
```

## Image with Caption
```
![Alt text for accessibility](image_url "This is the caption that will appear below the image")
```

## Example Usage in Your Blog Content:

```
# GIS-Driven Agritech Transformation

Our team at Geokits recently conducted a large-scale GIS-driven precision agriculture pilot across 40 acres in Punjab, Pakistan.

![GIS Agriculture Overview](/blogs/agr.png "Overview of our precision agriculture implementation in Punjab")

## The Need for GIS-Driven Agriculture

Pakistan's smallholder farms have long depended on traditional techniques—reading cloud formations for rain, visual crop inspections for pests, and fixed calendars for spraying.

![Traditional vs Modern Farming](/blogs/comparison.jpg "Comparison between traditional and GIS-enabled farming methods")

### Satellite Imagery Analysis
High-resolution multispectral satellite data was processed to monitor crop health, identify stress patterns, and track growth progression across different field zones.

![Satellite Analysis Results](/blogs/satellite-data.png "Results from our satellite imagery analysis showing crop health variations")

## Key Findings

### Weather Alert System Impact
Early notification of rain, frost, and heat waves led to **30% fewer instances** of water stress and **25% savings** on irrigation costs.

![Weather Impact Chart](/blogs/weather-impact.png "Chart showing the impact of weather alerts on crop management")

### Yield Improvement Results
Through variable-rate fertilizer application and precision irrigation, average crop yields rose by **20%** compared with neighboring farms using conventional methods.

![Yield Comparison](/blogs/yield-results.png "Comparison of yields between traditional and GIS-enabled farms")
```

## Image Features:

1. **Responsive Design**: Images automatically resize to fit the content width
2. **Hover Effects**: Same grayscale-on-hover effect as other images on your site
3. **Rounded Corners**: Modern, clean appearance with rounded corners
4. **Captions**: Optional captions that appear below images in italic gray text
5. **Proper Spacing**: Automatic spacing above and below images for good readability
6. **Accessibility**: Alt text for screen readers and SEO

## Image Guidelines:

- **Recommended Size**: 1200px wide or larger for best quality
- **Format**: JPG, PNG, or WebP
- **Location**: Store images in `/public/blogs/` folder
- **Naming**: Use descriptive filenames like `satellite-analysis-results.png`
- **Alt Text**: Always include descriptive alt text for accessibility

## Caption Best Practices:

- Keep captions concise but descriptive
- Use captions to provide context or additional information
- Captions appear in smaller, gray italic text below the image
