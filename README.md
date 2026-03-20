# Tab Scatter Chart

A React + TypeScript + Vite application for visualizing statistical benchmarking data using interactive scatter charts. This project provides reusable components for displaying business metrics like Revenue Growth vs MRR with percentile comparisons.

## Features

- **ScatterChart** – Interactive scatter plot component with D3.js-powered visualizations
- **ChartCard** – Container component with title, description, and status badges
- **Badge** – Status indicators (Live, Top 10%, Bottom 25%)
- **Statistical Data Support** – Display Q1, Median, Q3, and user values
- **Responsive Design** – Built with Tailwind CSS v4
- **Animations** – Smooth interactions powered by Framer Motion

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4 + @tailwindcss/vite
- **Data Visualization:** D3.js 7
- **Animations:** Framer Motion
- **Linting:** ESLint 9 + typescript-eslint

## Project Structure

```
tab-scatter-chart/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Badge.tsx          # Status badge component
│   │   ├── ChartCard.tsx      # Chart container with header
│   │   ├── ScatterChart.tsx   # Main scatter plot component
│   │   └── index.ts           # Component exports
│   ├── assets/
│   │   └── hero.png
│   ├── App.tsx                # Main application
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Component Usage

### ScatterChart

```tsx
import { ScatterChart } from './components';
import type { ChartStatistics } from './components/ScatterChart';

const data: ChartStatistics = {
  xAxis: { q1: 80102, median: 139250, q3: 139250, userValue: 139250 },
  yAxis: { q1: 18.57, median: 19.26, q3: 19.26, userValue: 19.26 },
};

<ScatterChart
  width={700}
  height={360}
  statistics={data}
  xAxisLabel="MRR (USD)"
  yAxisLabel="Revenue Growth Rate (%)"
/>
```

### ChartCard

```tsx
import { ChartCard, ScatterChart } from './components';

<ChartCard
  width={800}
  height={500}
  title="Revenue Growth vs MRR"
  description="Compare your growth rate against peer benchmarks"
  badgeType="live"
  badgeText="Live"
>
  <ScatterChart {...chartProps} />
</ChartCard>
```

### Badge Types

- `live` – Displays a pulsing red dot indicator
- `top` – Green badge for top performers
- `bottom` – Gray badge for bottom tier

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
