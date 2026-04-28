TASK: Use the following goal to create proposed use cases in `1-USE-CASES-PROPOSED.md`. Then, after review and approval, formalise them into `1-USE-CASES.md` for pipeline delivery.

# Goal

**SwampSimulator — An Interactive Wetland Ecosystem**

A web-based, real-time 2D swamp ecosystem simulation where every organism — plant, insect, fish, reptile, amphibian, and bird — fills a specific ecological niche. Remove any species and the whole web shifts. Add one back and watch balance return. The simulation is both a sandbox toy and an education tool for understanding interdependence, food chains, nutrient cycles, and population dynamics.

---

## Core Concept

The swamp is rendered as a scrollable 2D canvas viewed from above. Water channels, lily pads, mudbanks, tree roots, and open water zones tile the environment. Each organism is an autonomous agent following simple rules: eat, reproduce, flee, die. Emergent complexity arises from these interactions — without scripting a single story.

**Design pillars:**
- Every species has at least one predator and at least one prey or resource it depends on
- Population collapse of any species causes cascading visible effects on others
- The player observes and intervenes; the ecosystem runs on its own if left alone
- Data overlays (food web graph, population charts, nutrient flow) reveal what is invisible to the naked eye

---

## Ecosystem Layers

### Producers (Plants & Algae)
Anchor the entire food web. Grow using sunlight and nutrients in the water. Overgrow if herbivores are removed; die back if nutrients are depleted.

| Organism | Role |
|----------|------|
| Algae / Phytoplankton | Primary nutrient producer; oxygen source; base of aquatic food chain |
| Duckweed | Surface cover; reduces evaporation; food for ducks and turtles |
| Cattails | Shoreline stabiliser; nesting habitat; insect breeding ground |
| Water Lilies | Shelter for fish and frogs; frog spawning surface |
| Cypress Trees | Canopy shade; root structure provides micro-habitats; slow decomposition |
| Sawgrass | Dense cover for wading birds and nesting; erosion control |

---

### Primary Consumers (Herbivores & Filter Feeders)
Convert plant matter and algae into animal biomass. Population controlled by both food availability and predation.

| Organism | Role |
|----------|------|
| Mosquito Larvae | Filter algae from water; critical fish food source; early life-stage of adult mosquitoes |
| Tadpoles | Graze algae; transition into adult frogs; sensitive to water quality |
| Crayfish | Shred decaying plant matter; recycle nutrients; prey for fish, herons, raccoons |
| Snails | Graze algae off surfaces; slow nutrient recycler; bird and fish prey |
| Turtles (Painted / Slider) | Omnivore — eats algae, aquatic plants, and carrion; spreads seeds |
| Ducks | Graze duckweed and aquatic insects; disturb sediment releasing nutrients |

---

### Secondary Consumers (Carnivores & Omnivores)
Feed on herbivores and smaller animals. Regulate primary consumer populations and prevent algae blooms.

| Organism | Role |
|----------|------|
| Frogs (Tree Frog / Bullfrog) | Eat mosquitoes, dragonflies, small insects; prey for herons and snakes; bioindicator of water quality |
| Dragonflies | Eat mosquito adults and larvae; fast aerial hunters; prey for herons and bats |
| Catfish | Bottom-feeders; eat crayfish, snails, larvae, decaying matter; nutrient stirrers |
| Bass / Sunfish | Mid-water predator; eat tadpoles, small fish, crayfish; prey for herons and alligators |
| Water Snakes | Eat frogs, small fish, crayfish; prey for herons and alligators; control frog population |
| Raccoons | Generalist omnivore; eat crayfish, fish, turtle eggs, frogs, plants; nocturnal; large range |

---

### Apex Predators
Top of the food chain. Low population numbers; high individual impact on ecosystem structure.

| Organism | Role |
|----------|------|
| Great Blue Heron | Ambush predator; eats fish, frogs, snakes, crayfish; controls secondary consumer populations |
| Alligator / Crocodilian | Apex aquatic predator; creates "gator holes" that retain water in dry season; scavenger of large carcasses |
| River Otter | Social hunter; eats fish and crayfish; highly sensitive to water pollution |
| Osprey | Aerial fish hunter; nest on cypress tops; regional indicator of fish stock health |

---

### Decomposers & Nutrient Cyclers
Break down dead matter and return nutrients to the water and soil. Without them, the ecosystem starves.

| Organism | Role |
|----------|------|
| Bacteria / Fungi (invisible agents) | Decompose dead organisms; release nitrogen and phosphorus; drive nutrient cycle |
| Vultures | Aerial scavengers; clean large carcasses; prevent disease spread |
| Fireflies | Adults eat nothing (short lifespan); larvae eat snails and earthworms; decomposer niche |
| Mosquitoes (adult) | Pollinator of some swamp plants; prey for dragonflies, bats, frogs; disease vector mechanic |
| Beavers | Engineer species; dam streams to raise water levels; create new wetland habitat |

---

## Environmental Mechanics

| Factor | Effect |
|--------|--------|
| **Rainfall** | Raises water level; increases nutrient runoff; expands habitable area |
| **Drought** | Lowers water level; concentrates predators and prey at remaining pools; collapses oxygen |
| **Sunlight / Season** | Controls plant growth rate; affects cold-blooded animal activity; drives migration (ducks, osprey) |
| **Nutrient Level** | Too low: plants die → food chain collapses. Too high: algae bloom → oxygen crash → fish die |
| **Water Temperature** | Affects fish metabolism, frog spawning, alligator activity, mosquito breeding rate |
| **Pollution Event** | Player-triggerable or random; kills sensitive species first (otters, frogs, fish); teaches resilience |

---

## Simulation Screens

### Screen 1: Ecosystem View (Main Canvas)
- Scrollable 2D top-down swamp canvas
- Organisms rendered as animated sprites moving autonomously
- Click any organism to open the Species Inspector (name, population, role, dependencies)
- Environmental overlay toggles: food web, population heatmap, nutrient flow, oxygen level
- Time controls: play, pause, fast-forward (×1, ×5, ×30), season skip

### Screen 2: Food Web Graph
- Live force-directed graph showing all species as nodes
- Edges show predator→prey relationships, thickness proportional to energy flow
- Highlight a species to see its full dependency chain
- Population size encoded in node radius; red border = species in danger (<10% of baseline)

### Screen 3: Population Dashboard
- Line charts per species showing population over time
- Stacked bar chart showing biomass distribution across trophic levels
- Alert panel: species warnings, extinction events, bloom events, drought/flood notifications

### Screen 4: Intervention Panel
- Add or remove individual organisms or entire species
- Trigger environmental events: drought, flood, pollution, fire, cold snap
- Set carrying capacity overrides per species
- Restore to baseline preset (pristine swamp conditions)

### Screen 5: Guided Scenarios
- "Remove the Alligator" — observe heron and fish population shifts
- "Mosquito Explosion" — no dragonflies; track cascade effect on frogs and bats
- "Algae Bloom" — nutrient spike from fertiliser runoff; oxygen crash; fish die-off
- "Beaver Dam" — watch water level rise and new habitat emerge
- "Drought Year" — predator density at shrinking pools; survival pressure

---

## Key Differentiators

1. **Every species is causally connected** — there are no decorative organisms; every agent affects at least two others
2. **Emergent dynamics without scripting** — collapses, blooms, and recoveries arise from agent rules alone
3. **Trophic level visibility** — the food web graph shows abstract ecology as tangible structure
4. **Intervention → consequence loop** — player actions have delayed, realistic consequences that play out over simulated seasons
5. **Decomposer cycle is modelled** — nutrients return to the water; without decomposers, growth stops

---

## Technology Stack (Recommended)

- **Frontend:** Vanilla HTML5 Canvas 2D, ES Modules, no framework
- **Agent System:** Per-tick update loop; each organism is an autonomous agent object with state (energy, age, position, target)
- **Spatial Indexing:** Grid-bucket spatial hash for O(1) neighbour lookups (predator/prey detection)
- **Population Model:** Discrete agent simulation (not Lotka-Volterra equations); emergent population curves
- **Charts:** Chart.js or D3.js for population dashboard
- **Storage:** localStorage for save/load of ecosystem states and scenario progress

---


