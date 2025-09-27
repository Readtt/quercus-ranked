# Quercus Ranked

A browser extension and web application that helps University of Toronto students easily view assignment averages and compare their performance within Quercus courses.

## 🌐 Live Demo
- **Web App**: https://quercus-ranked-web.vercel.app
- **Chrome Extension**: [Install the Chrome Extension](https://quercus-ranked-web.vercel.app/extension)
- **GitHub Repository**: https://github.com/Readtt/quercus-ranked

## 🚀 Features

- **Assignment Averages**: View class averages for assignments across all your Quercus courses
- **Performance Comparison**: Compare your grades against class averages with color-coded indicators
- **Course Overview**: Get a comprehensive view of all your courses and assignments in one place
- **Real-time Data**: Automatically syncs with your Quercus account to get the latest assignment data
- **Clean UI**: Modern, intuitive interface built with React and shadcn/ui components

## 📦 What's Included

This monorepo contains:

- **Browser Extension** (`apps/extension/`): Chrome extension that integrates with Quercus
- **Web Application** (`apps/web/`): Next.js web app for data visualization
- **Shared Packages**:
  - `packages/quercus-client/`: TypeScript client for Quercus API
  - `packages/ui/`: Shared UI components using shadcn/ui
  - `packages/eslint-config/`: Shared ESLint configuration
  - `packages/typescript-config/`: Shared TypeScript configuration

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Web App**: Next.js 15 with Turbopack
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Build Tool**: Turbo (monorepo management)
- **Package Manager**: pnpm
- **Database**: Neon (PostgreSQL)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quercus-ranked.git
   cd quercus-ranked
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   
   Create a Neon database and run the following SQL to create the required table:
   ```sql
   CREATE TABLE assignment_scores (
     user_hash VARCHAR(64) NOT NULL,
     course_id INTEGER NOT NULL,
     assignment_id INTEGER NOT NULL,
     percent INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     PRIMARY KEY (assignment_id, user_hash)
   );
   
   CREATE INDEX idx_assignment_scores_assignment_id ON assignment_scores(assignment_id);
   CREATE INDEX idx_assignment_scores_user_hash ON assignment_scores(user_hash);
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `apps/web` directory:
   ```env
   NEON_DATABASE_URL=your_neon_database_url
   USER_HASH_SECRET=super-long-random-string
   ```

5. **Start the project**
   ```bash
   pnpm install
   pnpm dev
   ```

### Development

Start all applications in development mode:

```bash
pnpm dev
```

This will start:
- Web app at `http://localhost:3000`
- Extension build in watch mode

### Browser Extension Setup

1. Build the extension:
   ```bash
   pnpm dev
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `apps/extension/build` directory

3. Navigate to `https://q.utoronto.ca` and use the extension

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Privacy & Security

- The extension only accesses Quercus data that you're already authorized to view
- No personal data- except anonymized grades are stored on external servers
- Assignment averages are calculated from anonymized data

## 🐛 Known Issues

- Extension requires manual refresh after Quercus login
- Some assignment types may not display averages correctly (open an issue)
- Performance may be slow with many courses/assignments

---

**Note**: This project is not officially affiliated with the University of Toronto or the Quercus platform.
