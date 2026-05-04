# Fish Tank Simulator - Application Specifications

## Project Overview

**Fish Tank Simulator** is an interactive, aesthetically pleasing virtual aquarium application that provides a realistic and immersive experience of maintaining an exotic fish tank. The application features dynamic physics simulation, fluid dynamics, diverse marine life, interactive environmental elements, and a calming, visually engaging interface.

---

## 1. Visual & Aesthetic Requirements

### 1.1 Graphics & Rendering
- **Rendering Engine**: WebGL 2.0 or equivalent (Three.js, Babylon.js, or custom engine)
- **Resolution Support**: Responsive design, minimum 1280x720px, maximum 4K (3840x2160px)
- **Frame Rate**: 60 FPS target on modern hardware, minimum 30 FPS on lower-end devices
- **Color Palette**: Warm, calming underwater tones with emphasis on bioluminescence and light rays
- **Lighting Model**: 
  - Realistic water refraction and caustic effects
  - Multiple light sources (sunlight, bioluminescence from fish/plants)
  - Dynamic shadow mapping for immersion
  - Underwater light diffusion and particle scattering

### 1.2 Water Simulation
- **Water Surface**: Animated water surface with realistic wave propagation
- **Caustics**: Dynamic caustic patterns reflecting light through water
- **Turbidity**: Adjustable water clarity (affects visibility distance)
- **Fluid Dynamics**:
  - Fish movement creates water displacement ripples
  - Bubbler creates bubbling streams and localized currents
  - Plants sway with water currents
  - Debris (particles, food) moves with simulated water currents
- **Particle Effects**: Dust particles, sand particles, and sediment floating realistically
- **Transparency & Refraction**: Glass tank edges with realistic refraction effects

### 1.3 Overall Ambiance
- **Camera**: Static isometric or 3/4 view of the tank (user-selectable)
- **Background**: Darkened aquarium room with soft ambient light
- **UI Overlay**: Minimalist, non-intrusive HUD with soft animations
- **Audio**: Optional ambient underwater soundscapes, soft bubble sounds, gentle music

---

## 2. Environment Design

### 2.1 Tank Dimensions & Structure
- **Tank Size**: Customizable (default: 120cm x 60cm x 60cm proportional representation)
- **Tank Material**: Glass with realistic reflections and slight green tint
- **Tank Components**:
  - Glass walls (front, back, left, right)
  - Sand/gravel substrate at the bottom
  - Decorative elements secured to substrate or walls
  - Water fill level (adjustable, realistic physics-based)

### 2.2 Sunken Ship Wreck
- **Design**: 
  - Detailed 3D model of a 2-3 meter shipwreck
  - Multiple windows and doors
  - Weathered, moss-covered appearance
  - Partially buried in substrate
- **Functionality**:
  - Fish can swim through windows and doors
  - Provides hiding spots and shade
  - Accumulates sediment over time
  - Treasure chests and artifacts visible through windows

### 2.3 Treasure & Artifacts
- **Treasure Chests**: 2-3 ornate chests scattered around/in wreck
  - Closed or slightly open state
  - Gold and jewel details with shimmer effects
- **Artifacts**: Anchors, pottery, coins, coral-encrusted objects
  - Serve as both visual elements and fish obstacles
  - Create diverse swimming paths and hiding spots

### 2.4 Flora System
- **Plant Types** (procedurally selected at startup, 4-8 plants):
  - **Tall Plants**: Kelp, tall seagrass (sway with currents)
  - **Bushy Plants**: Sea lettuce, caulerpa (dense shelter)
  - **Delicate Plants**: Feather dusters, soft corals (gently wave)
  - **Carpet Plants**: Moss, low seagrass (cover substrate)
  - **Floating Plants**: Water sprite, frogbit (float near surface)
- **Dynamics**:
  - Sway and bend realistically with water currents
  - React to fish movement
  - Occasional bubbles rise from plant edges
  - Slow growth/decay cycle over play session (visual only)
  - Variety in color (greens, reds, purples)

### 2.5 Bubbler System
- **Bubbler Design**: Ornamental air stone, sand stone, or decorative tube
- **Bubble Generation**:
  - Continuous stream of bubbles at configurable rate (30-200 bubbles/minute)
  - Bubbles vary in size (1-5mm radius)
  - Realistic buoyancy and rise physics
- **Bubble Physics**:
  - Rise with slight randomized horizontal drift
  - Pop near water surface with particle effect
  - Create localized water current effects
  - Can interact with fish (non-collision, visual effect)

### 2.6 Substrate & Decoration
- **Substrate Types** (selectable):
  - Sand (fine, light colored, creates dust clouds)
  - Gravel (medium stones, various colors)
  - Dark substrate (rich appearance, contrasts with fish)
- **Substrate Features**:
  - Particles settle slowly when disturbed
  - Slight surface irregularities
  - Decay of food particles over time
- **Additional Decorations** (2-4 pieces):
  - Rocks/boulders
  - Driftwood
  - Ceramic caves
  - Coral colonies
  - Randomly placed for variety

---

## 3. Fish System

### 3.1 Fish Species & Variety
- **Minimum Fish Types**: 12-15 distinct species
- **Fish Categories**:
  - **Small Fish** (2-3cm): Neon tetras, guppies, cardinal fish
  - **Medium Fish** (5-8cm): Angelfish, discus, danios
  - **Large Fish** (10-15cm): Oscars, gouramis, plecos
  - **Exotic Species**: Seahorses, mandarinfish, lionfish, jawfish
- **Visual Variety**:
  - Diverse colors and patterns
  - Different body shapes (streamlined, round, flattened)
  - Unique fin designs and movements
  - Bioluminescent accents on certain species
  - Scale and gill details

### 3.2 Fish Behavior & Swimming
- **Individual Swimming Styles**:
  - **Darting Fish**: Quick, jerky movements (tetras, danios) - acceleration/deceleration patterns
  - **Graceful Fish**: Smooth, flowing movements (angelfish, discus) - curved trajectories
  - **Bottom Dwellers**: Slow cruising along substrate (plecos, corydoras) - follow ground
  - **Hovering Fish**: Relatively stationary with gentle fin movements (seahorses, mandarinfish)
  - **Aggressive Swimmers**: Fast, powerful strokes (oscars, sharks) - direct pathfinding
- **Movement Parameters** (per species):
  - Speed range (min/max velocity)
  - Acceleration/deceleration rate
  - Turn radius (agility)
  - Preferred water zone (top, middle, bottom)
  - Vertical preference angle
- **AI Pathfinding**:
  - Avoid obstacles (plants, decorations, tank walls)
  - Seek open spaces
  - Occasional directional changes for naturalistic behavior
  - Fleeing behavior when threatened or startled
  - Schooling behavior for compatible species

### 3.3 Fish Interactions
- **Hunger System**:
  - Fish become "hungry" over a 2-5 minute cycle
  - Hungry fish show visual changes (duller color, slower movement)
  - Fed fish show improved colors and energy
- **Social Behavior**:
  - Some species school together (tetras, danios)
  - Some species are solitary (bettas, oscars)
  - Territorial behavior near decorations (hiding spots)
  - Curiosity toward player interactions
- **Daily Rhythm**:
  - Night mode (if implemented): Some fish rest, activity reduced
  - Day mode: Active swimming, feeding

### 3.4 Fish Population
- **Starting Population**: 8-15 fish (user selectable)
- **Fish Distribution**:
  - Balanced mix of small, medium, and large species
  - Compatible species only (no predator-prey in tank)
  - Procedurally generated on session start
- **Lifespan**: Visual only—fish don't die in current version
- **Maximum Fish**: 20-25 fish (performance limit)

---

## 4. Water Physics & Dynamics

### 4.1 Fluid Simulation
- **Method**: SPH (Smoothed Particle Hydrodynamics) or grid-based approach for performance
- **Current Generation**:
  - Fish movement creates velocity field disturbance
  - Bubbler creates upward current
  - Surface disturbance propagates outward
- **Particle Advection**:
  - Food particles move with fluid flow
  - Plant motion influenced by local velocities
  - Decorative particles (sediment) settle slowly with minor drift
- **Performance**: Real-time calculation optimized for 60 FPS

### 4.2 Surface Waves
- **Wave Simulation**:
  - Fish breaking surface creates ripples
  - Bubbles breaking surface create ring waves
  - Wave propagation follows realistic physics
  - Dampening over distance (viscosity)
- **Visual Effect**:
  - Ripple texture displacement on water surface
  - Caustic pattern distortion from ripples
  - Shadow mapping updates from wave displacement

### 4.3 Buoyancy & Gravity
- **Gravity Effect**: 0.98 * normal gravity (underwater environment)
- **Buoyancy**:
  - Fish neutrally buoyant (don't sink)
  - Bubbles rise predictably
  - Particles settle with drag coefficient
  - Plants sway but remain anchored

---

## 5. User Interaction System

### 5.1 Feeding Mechanism
- **Input Method**: Click/tap near water surface or use "Feed" button
- **Food Types**:
  - Pellets (small, dense, sink slowly)
  - Flakes (very light, float initially)
  - Live food simulation (small moving particles)
  - Worms (wiggling motion as they sink)
- **Food Physics**:
  - Spawn at cursor location or bubbler area
  - Follow gravity and water currents
  - Dissipate/despawn after 30-60 seconds (uneaten)
  - Visual feedback when fish eat (particles vanish, fish mouth opens)
- **Feeding Constraints**:
  - Maximum 3-5 feeding actions per minute (prevent spam)
  - Visual cooldown indicator
  - Daily feed recommendation (1-3x per day)

### 5.2 Interactive Elements
- **Tap/Click Actions**:
  - Click fish to highlight/track them
  - Click decorations for information tooltips
  - Drag to scatter food
  - Pinch to zoom (mobile)
- **Touch Feedback**:
  - Fish react to screen touches (startle/flee)
  - Particles react to click location (small disturbance)
  - Haptic feedback on supported devices

### 5.3 Camera Controls
- **View Modes**:
  - Static Default (isometric 3/4 view)
  - Top-down view
  - Fish-following mode (track selected fish)
  - Free camera (if implemented for advanced users)
- **Zoom**: 60% to 150% (mobile: pinch gesture)
- **Pan**: Click-drag or WASD keys (desktop)

### 5.4 Settings & Customization
- **Visual Settings**:
  - Quality presets (Low, Medium, High, Ultra)
  - Water turbidity/clarity slider
  - Lighting intensity
  - Particle effect intensity
  - UI scale
- **Audio Settings**:
  - Master volume, SFX volume, music volume
  - Toggle ambient sounds, bubble sounds
  - Toggle background music
- **Tank Settings**:
  - Tank background color
  - Substrate type
  - Plant variety randomization
  - Fish population size
  - Fish feeding frequency recommendation
- **Save/Load**:
  - Local storage of preferences
  - Export tank snapshot as image
  - Optional cloud save (future feature)

---

## 6. User Interface (UI)

### 6.1 Main HUD
- **Top-Right Corner**:
  - Fish count indicator with small icons
  - Water quality/health status
  - Time in tank session
- **Bottom-Left Corner**:
  - Feed button with cooldown indicator
  - Quick settings icon
  - Help/information button
- **Bottom-Right Corner**:
  - Camera control buttons (optional)
  - Zoom slider
- **Center Bottom** (toggleable):
  - Selected fish information panel (name, species, mood)
  - Tank statistics (temperature, pH simulation, etc.)

### 6.2 Menus
- **Main Menu**:
  - Start New Tank
  - Settings
  - About/Help
  - Credits
- **Pause Menu** (if implemented):
  - Resume
  - Settings
  - Quit
- **Settings Menu**:
  - Organized into tabs: Graphics, Audio, Tank, UI
  - Live preview of changes
  - Reset to defaults option

### 6.3 Information Panels
- **Fish Info** (on click):
  - Species name and common name
  - Mood/health indicator
  - Feeding status
  - Interesting facts
  - Dismiss button
- **Tank Info** (on demand):
  - Session duration
  - Total fish fed
  - Current fish count
  - Tank health metrics

### 6.4 Animations & Transitions
- **Smooth Fades**: Menu transitions, panel appearances
- **Tooltip Animations**: Gentle pop-in effects
- **Button Feedback**: Visual press states, color changes
- **Feed Confirmation**: Particle burst effect, visual feedback

---

## 7. Performance Requirements

### 7.1 Target Devices
- **Desktop**: Chrome, Firefox, Safari, Edge (modern versions)
- **Mobile**: iOS Safari (iOS 13+), Android Chrome
- **Tablet**: Full responsive support

### 7.2 Performance Targets
- **Frame Rate**: 60 FPS on recommended hardware, 30 FPS minimum
- **Load Time**: < 3 seconds on high-speed connection
- **Memory Usage**: < 256MB typical operation
- **Recommended Hardware**:
  - Desktop: Intel i5/AMD Ryzen 5, 8GB RAM, integrated GPU
  - Mobile: iPhone 11+, Android flagship or mid-range (2019+)

### 7.3 Optimization Strategies
- **LOD (Level of Detail)**:
  - Distant fish use simpler models
  - Plant geometry reduces at distance
  - Particle count scales with quality setting
- **Culling**:
  - Objects outside viewport not rendered
  - Batched rendering for identical objects
- **Texture Optimization**:
  - Atlased textures
  - Mipmapping for distant objects
  - Compressed formats (WebP with fallback)
- **Shader Optimization**:
  - Deferred rendering for multiple lights
  - Simplified caustics on lower-end devices

---

## 8. Audio Design

### 8.1 Sound Effects
- **Ambient Sounds**:
  - Gentle water ambience (continuous, low volume)
  - Occasional fish movements (subtle sounds)
  - Bubbler bubble sounds (light, rhythmic)
- **Interaction Sounds**:
  - Feed button click (soft chime)
  - Food dropping (light splash)
  - Fish feeding (subtle gulping sound)
  - UI interactions (gentle beeps)
- **Environmental Sounds**:
  - Light filter hum (almost imperceptible)
  - Occasional water movement shifts
  - Tank settling sounds (very rare)

### 8.2 Music
- **Background Music** (optional, toggleable):
  - Ambient underwater soundtrack
  - Looping, non-intrusive
  - Soft instrumental style
  - Can be muted individually from SFX

### 8.3 Audio Levels
- **Master Volume**: 0-100%
- **SFX Volume**: 0-100% (independent)
- **Music Volume**: 0-100% (independent)
- **Default**: Master 60%, SFX 70%, Music 50%

---

## 9. Data & Persistence

### 9.1 Local Storage
- **Session Data** (localStorage/IndexedDB):
  - User preferences and settings
  - Tank customization
  - Session statistics
  - Last visited timestamp
- **Storage Capacity**: Minimum 5MB allocated
- **Data Structure**:
  ```json
  {
    "preferences": {
      "audioEnabled": true,
      "masterVolume": 0.6,
      "qualityPreset": "high",
      "waterClarity": 0.8
    },
    "tank": {
      "substrateType": "sand",
      "fishCount": 12,
      "plantVariety": "mixed",
      "backgroundColor": "#1a4d4d"
    },
    "statistics": {
      "sessionDuration": 3600,
      "totalFeedActions": 45,
      "favoriteSpecies": ["angelfish", "neon tetra"]
    }
  }