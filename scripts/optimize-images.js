// Script to download images from Unsplash and convert to WebP
const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const images = [
    {
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=800&fit=crop',
        name: 'hero-solar.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=500&fit=crop',
        name: 'about-install.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop',
        name: 'about-panels.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400&h=300&fit=crop',
        name: 'about-team.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=500&fit=crop',
        name: 'about-farm.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=600&h=400&fit=crop',
        name: 'project-residential.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&h=400&fit=crop',
        name: 'project-commercial.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
        name: 'project-industrial.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=400&fit=crop',
        name: 'project-farm.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?w=600&h=400&fit=crop',
        name: 'project-campus.webp'
    },
    {
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop',
        name: 'project-hotel.webp'
    }
];

const outputDir = path.join(__dirname, 'images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadImage(response.headers.location).then(resolve).catch(reject);
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

async function processImage(image) {
    try {
        console.log(`Downloading: ${image.name}...`);
        const buffer = await downloadImage(image.url);

        const outputPath = path.join(outputDir, image.name);

        // Convert to WebP with compression
        await sharp(buffer)
            .webp({ quality: 80 }) // 80% quality for good balance
            .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        console.log(`✓ Saved: ${image.name} (${Math.round(stats.size / 1024)}KB)`);
        return { name: image.name, size: stats.size };
    } catch (error) {
        console.error(`✗ Error processing ${image.name}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('Starting image optimization...\n');

    const results = [];
    for (const image of images) {
        const result = await processImage(image);
        if (result) results.push(result);
    }

    console.log('\n--- Summary ---');
    console.log(`Processed: ${results.length}/${images.length} images`);
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    console.log(`Total size: ${Math.round(totalSize / 1024)}KB`);
}

main().catch(console.error);
