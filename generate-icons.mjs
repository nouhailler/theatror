// Run with: node generate-icons.mjs
// Requires: npm install -D sharp (or just use the SVG favicon — browsers accept it)
//
// Quick alternative: open public/favicon.svg in Inkscape or any converter,
// export as PNG at 192×192 → public/icons/icon-192.png
//                 and 512×512 → public/icons/icon-512.png
//
// Or use https://realfavicongenerator.net with the SVG file.

import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0a0a0f'
  const r = size * 0.18
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.arcTo(size, 0, size, r, r)
  ctx.lineTo(size, size - r)
  ctx.arcTo(size, size, size - r, size, r)
  ctx.lineTo(r, size)
  ctx.arcTo(0, size, 0, size - r, r)
  ctx.lineTo(0, r)
  ctx.arcTo(0, 0, r, 0, r)
  ctx.closePath()
  ctx.fill()

  // Accent bar
  ctx.fillStyle = '#c0392b'
  ctx.fillRect(size * 0.1, size * 0.82, size * 0.8, size * 0.06)

  // Emoji
  ctx.font = `${size * 0.55}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🎭', size / 2, size * 0.44)

  return canvas.toBuffer('image/png')
}

try {
  writeFileSync('public/icons/icon-192.png', drawIcon(192))
  writeFileSync('public/icons/icon-512.png', drawIcon(512))
  console.log('Icons generated!')
} catch (e) {
  console.error('Need canvas package: npm install -D canvas')
  console.log('Alternative: use https://realfavicongenerator.net with public/favicon.svg')
}
