# Client Showcase Documentation

## Overview
The client showcase feature displays your creative clients in an animated, cycling grid on the homepage Design/Video Editor section.

## Features
✨ **Animated Grid**: Shows 4 clients at once in a 2x2 grid on mobile, 1x4 on desktop
🔄 **Auto-Cycling**: Automatically cycles through client sets every 4 seconds
🎯 **Interactive**: Users can click dots to jump to specific sets
📱 **Mobile Optimized**: Responsive design that works on all devices
🎨 **Purple Theme**: Matches the creative/design section aesthetic
✨ **Hover Effects**: Beautiful hover animations with glow effects

## How to Customize

### 1. Update Client Names
Edit `/lib/client-data.ts`:

```typescript
export const creativeClients = [
  // Set 1 - Replace with your actual clients
  ['Your Client 1', 'Your Client 2', 'Your Client 3', 'Your Client 4'],
  
  // Set 2 
  ['Client 5', 'Client 6', 'Client 7', 'Client 8'],
  
  // Add more sets as needed
  ['Client 9', 'Client 10', 'Client 11', 'Client 12'],
];
```

### 2. Customize Settings
Modify the configuration in `/lib/client-data.ts`:

```typescript
export const clientShowcaseConfig = {
  // Time each set is displayed (in milliseconds)
  cycleDuration: 4000, // 4 seconds
  
  // Animation settings
  animationDuration: 0.8,
  staggerDelay: 0.15, // Delay between each card animation
  
  // Display settings
  showHeader: true,
  headerText: 'Trusted by Amazing Clients', // Change this text
  projectTypeText: 'Creative Project', // Text under each client name
};
```

## Layout Structure

```
Design/Video Editor Section
├── Skills Stripe (moving badges)
├── Client Showcase ← NEW
│   ├── Header ("Trusted by Amazing Clients")
│   ├── 2x2 Grid (mobile) / 1x4 Grid (desktop) 
│   └── Dot Indicators
└── View Portfolio Button
```

## Animation Details

1. **Entry Animation**: Slides up with scale and 3D rotation
2. **Cycle Animation**: Fade out up, fade in down with scale
3. **Stagger Effect**: Each card animates 0.15s after the previous
4. **Hover Effects**: 
   - Scale up slightly
   - Purple glow effect
   - Floating particle animation
   - Color transitions

## Tips

- **Optimal Client Count**: Use 4 clients per set for best visual balance
- **Name Length**: Keep client names reasonably short (2-3 words max)
- **Set Count**: You can have as many sets as needed - the component handles any number
- **Performance**: The component is optimized with proper cleanup and efficient animations

## Styling

The component uses:
- Purple theme (`purple-500` variants) to match the Design/Video Editor section
- Dashboard cards with hover effects
- Mobile-first responsive design
- Terminal-inspired typography

## Future Enhancements

Possible improvements you could add:
- Client logos instead of/alongside names
- Links to client case studies
- Different animation styles per set
- Pause on hover functionality
- Sound effects (if desired)